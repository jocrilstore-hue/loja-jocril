import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/email/send";

const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone inválido"),
  company: z.string().optional(),
  nif: z.string().optional(),
});

const shippingSchema = z.object({
  address: z.string().min(1, "Morada é obrigatória"),
  address2: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  postalCode: z.string().min(4, "Código postal inválido"),
  country: z.string().default("Portugal"),
});

const orderItemSchema = z.object({
  variantId: z.number(),
  quantity: z.number().min(1),
  unitPrice: z.number(),
  totalPrice: z.number(),
  productName: z.string().optional(),
  productSku: z.string().optional(),
  sizeFormat: z.string().optional(),
});

const createOrderSchema = z.object({
  customer: customerSchema,
  shipping: shippingSchema,
  items: z.array(orderItemSchema).min(1, "Carrinho vazio"),
  subtotal: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  legalConsent: z.boolean().refine((value) => value === true, {
    message: "Aceite os Termos e a Política de Privacidade",
  }),
  notes: z.string().optional(),
});

// GET - Fetch order by order_number or user's orders
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("order_number");
    const { userId } = await auth();

    if (orderNumber) {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Autenticação necessária" },
          { status: 401 }
        );
      }

      const { data: order, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          customer:customers(*),
          shipping_address:shipping_addresses(*),
          items:order_items(*)
        `
        )
        .eq("order_number", orderNumber)
        .single();

      if (error || !order) {
        return NextResponse.json(
          { success: false, error: "Encomenda não encontrada" },
          { status: 404 }
        );
      }

      const customer = order.customer as { auth_user_id?: string } | null;
      if (!customer?.auth_user_id || customer.auth_user_id !== userId) {
        return NextResponse.json(
          { success: false, error: "Não autorizado" },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      );
    }

    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (!customer) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*)
      `
      )
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao carregar encomendas" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Create new order (Atomic via RPC)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const parseResult = createOrderSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: errors },
        { status: 400 }
      );
    }

    const { customer, shipping, items, subtotal, shippingCost, total, notes } = parseResult.data;

    const { userId } = await auth();

    // Server-side price validation
    const variantIds = items.map((item) => item.variantId);
    const { data: variants, error: variantError } = await supabase
      .from("product_variants")
      .select("id, base_price_including_vat")
      .in("id", variantIds);

    if (variantError || !variants) {
      return NextResponse.json(
        { success: false, error: "Erro ao validar preços" },
        { status: 500 }
      );
    }

    const priceMap = new Map(variants.map((v) => [v.id, v.base_price_including_vat]));
    for (const item of items) {
      const serverPrice = priceMap.get(item.variantId);
      if (serverPrice === undefined) {
        return NextResponse.json(
          { success: false, error: "Produto não encontrado", code: "PRODUCT_NOT_FOUND" },
          { status: 404 }
        );
      }
      if (Math.abs(serverPrice - item.unitPrice) > 0.01) {
        return NextResponse.json(
          {
            success: false,
            error: "price_changed",
            message: "Price has changed. Please refresh your cart.",
          },
          { status: 400 }
        );
      }
    }

    const p_customer = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company || null,
      nif: customer.nif || null,
      auth_user_id: userId || null,
    };

    const p_shipping_address = {
      address: shipping.address,
      address2: shipping.address2 || null,
      city: shipping.city,
      postal_code: shipping.postalCode,
      country: shipping.country || "Portugal",
    };

    const p_order = {
      subtotal,
      shipping_cost: shippingCost,
      total,
      notes: notes || null,
    };

    const p_items = items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      product_name: item.productName || null,
      product_sku: item.productSku || null,
      size_format: item.sizeFormat || null,
    }));

    const { data: rpcResult, error: rpcError } = await supabase.rpc("create_complete_order", {
      p_customer,
      p_shipping_address,
      p_order,
      p_items,
    });

    if (rpcError) {
      console.error("Order RPC error:", rpcError);

      if (rpcError.message?.includes("Stock insuficiente")) {
        return NextResponse.json(
          {
            success: false,
            error: rpcError.message,
            code: "INSUFFICIENT_STOCK",
          },
          { status: 409 }
        );
      }

      if (rpcError.message?.includes("Produto não encontrado")) {
        return NextResponse.json(
          {
            success: false,
            error: rpcError.message,
            code: "PRODUCT_NOT_FOUND",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Erro ao criar encomenda" },
        { status: 500 }
      );
    }

    if (!rpcResult?.success || !rpcResult?.order_id || !rpcResult?.order_number) {
      console.error("Invalid RPC response:", rpcResult);
      return NextResponse.json(
        { success: false, error: "Erro inesperado ao criar encomenda" },
        { status: 500 }
      );
    }

    // Fire-and-forget emails (B7)
    sendOrderConfirmation({
      orderNumber: rpcResult.order_number,
      customerName: customer.name,
      customerEmail: customer.email,
      total,
    });
    sendAdminNotification({
      orderNumber: rpcResult.order_number,
      customerName: customer.name,
      customerEmail: customer.email,
      total,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: rpcResult.order_id,
          orderNumber: rpcResult.order_number,
        },
        message: "Encomenda criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
