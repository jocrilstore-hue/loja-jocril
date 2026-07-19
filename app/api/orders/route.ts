import { createServiceClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/email/send";
import { issueOrderToken } from "@/lib/orders/token";
import { priceOrder, fromCents, toCents, PricingConfigError, type PriceTierRow } from "@/lib/pricing";

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

// Server-side shipping tiers. Mirrors the client logic in
// app/(store)/carrinho/page.tsx (`shippingCost = ctt-expresso ? 4.90 : pickup ? 0 : 7.90`).
// The client sends only the resulting cost (not the method key), so we validate the
// submitted shippingCost against this known allow-list rather than derive it from a method.
const ALLOWED_SHIPPING_COSTS = [0, 4.9, 7.9] as const;
const PRICE_TOLERANCE = 0.01; // cent-level rounding tolerance

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

// GET - Fetch order by order_number or user's orders.
// Authorization: Clerk user + ownership (auth_user_id) — enforced below before
// any data leaves. Service client is required once RLS closes anon access.
export async function GET(request: Request) {
  try {
    const supabase = createServiceClient();
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

// POST - Create new order (Atomic via RPC).
// Public (guest checkout). Every monetary value is derived server-side from DB
// prices (lib/pricing.ts); client values are only compared to detect a stale
// cart. The RPC is called with the service client — its anon EXECUTE grant is
// revoked in the RLS cutover migration.
export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();
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

    // Canonical server-side pricing: fetch DB base prices + tiers, compute
    // every amount in cents. Client values are never used as a source.
    const variantIds = items.map((item) => item.variantId);
    const [variantsRes, tiersRes] = await Promise.all([
      supabase
        .from("product_variants")
        .select("id, base_price_including_vat")
        .in("id", variantIds),
      supabase
        .from("price_tiers")
        .select("product_variant_id, min_quantity, max_quantity, price_per_unit")
        .in("product_variant_id", variantIds),
    ]);

    if (variantsRes.error || !variantsRes.data) {
      return NextResponse.json(
        { success: false, error: "Erro ao validar preços" },
        { status: 500 }
      );
    }
    if (tiersRes.error) {
      return NextResponse.json(
        { success: false, error: "Erro ao validar preços" },
        { status: 500 }
      );
    }

    const baseMap = new Map(variantsRes.data.map((v) => [v.id, v.base_price_including_vat]));
    const tiersMap = new Map<number, PriceTierRow[]>();
    for (const t of tiersRes.data ?? []) {
      const list = tiersMap.get(t.product_variant_id) ?? [];
      list.push(t);
      tiersMap.set(t.product_variant_id, list);
    }

    for (const item of items) {
      if (!baseMap.has(item.variantId)) {
        return NextResponse.json(
          { success: false, error: "Produto não encontrado", code: "PRODUCT_NOT_FOUND" },
          { status: 404 }
        );
      }
    }

    const serverShippingCost = ALLOWED_SHIPPING_COSTS.find(
      (cost) => Math.abs(cost - shippingCost) <= PRICE_TOLERANCE
    );
    if (serverShippingCost === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_shipping_cost",
          message: "Portes de envio inválidos.",
        },
        { status: 400 }
      );
    }

    let pricing;
    try {
      pricing = priceOrder(
        items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          basePriceEuros: baseMap.get(item.variantId)!,
          tiers: tiersMap.get(item.variantId) ?? [],
        })),
        toCents(serverShippingCost)
      );
    } catch (e) {
      if (e instanceof PricingConfigError) {
        console.error("Pricing configuration error:", e.message);
        return NextResponse.json(
          { success: false, error: "Erro de configuração de preços" },
          { status: 500 }
        );
      }
      throw e;
    }

    // UX check only: if the client's cart totals drifted from the canonical
    // ones (stale prices, tier boundary crossed), ask it to refresh instead of
    // silently charging a different amount than the user saw.
    const serverSubtotal = fromCents(pricing.subtotalCents);
    const serverTotal = fromCents(pricing.totalCents);
    if (
      Math.abs(serverSubtotal - subtotal) > PRICE_TOLERANCE ||
      Math.abs(serverTotal - total) > PRICE_TOLERANCE
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "total_mismatch",
          message: "Os valores da encomenda não correspondem. Atualize o carrinho.",
        },
        { status: 400 }
      );
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
      subtotal: serverSubtotal,
      shipping_cost: serverShippingCost,
      total: serverTotal,
      notes: notes || null,
    };

    const lineByVariant = new Map(pricing.lines.map((l) => [l.variantId, l]));
    const p_items = items.map((item) => {
      const line = lineByVariant.get(item.variantId)!;
      return {
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: fromCents(line.unitPriceCents),
        total_price: fromCents(line.lineTotalCents),
        product_name: item.productName || null,
        product_sku: item.productSku || null,
        size_format: item.sizeFormat || null,
      };
    });

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
      total: serverTotal,
    });
    sendAdminNotification({
      orderNumber: rpcResult.order_number,
      customerName: customer.name,
      customerEmail: customer.email,
      total: serverTotal,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: rpcResult.order_id,
          orderNumber: rpcResult.order_number,
          // Guest capability: grants payment initiation + status polling +
          // confirmation-page access for THIS order only (HMAC, expires).
          accessToken: issueOrderToken(rpcResult.order_number),
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
