import { createServiceClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyOrderToken } from "@/lib/orders/token";
import {
  createMBWayPayment,
  validatePhoneNumber,
  maskPhoneNumber,
  EuPagoError,
} from "@/lib/payments/eupago";

const requestSchema = z.object({
  orderId: z.string().min(1),
  phoneNumber: z.string().min(9),
  accessToken: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Dados em falta" },
        { status: 400 }
      );
    }

    const { orderId, phoneNumber, accessToken } = parsed.data;

    // Guest capability check: the token issued at order creation must match
    // THIS order. Without it, an anonymous caller could drive payments for
    // arbitrary order numbers (service client bypasses RLS).
    if (!verifyOrderToken(accessToken, orderId)) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 403 }
      );
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: "Número de telemóvel inválido. Use formato 9XXXXXXXX (91, 92, 93 ou 96)",
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, total_amount_with_vat, payment_status")
      .eq("order_number", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Encomenda não encontrada" },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { success: false, error: "Esta encomenda já foi paga" },
        { status: 400 }
      );
    }

    const result = await createMBWayPayment(
      order.order_number,
      order.total_amount_with_vat,
      phoneNumber
    );

    // Persistence must succeed and affect exactly one row before we report
    // success — a payment the DB does not know about cannot be reconciled.
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_method: "mbway",
        eupago_transaction_id: result.reference,
        payment_status: "pending",
      })
      .eq("id", order.id)
      .select("id");

    if (updateError || !updated || updated.length !== 1) {
      console.error("Error updating order with MB Way info:", updateError, updated);
      return NextResponse.json(
        { success: false, error: "Erro ao registar o pagamento. Contacte-nos." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: result.reference,
        amount: result.amount,
        phone: maskPhoneNumber(phoneNumber),
      },
      message: "Pedido de pagamento enviado. Confirme no seu telemóvel.",
    });
  } catch (error) {
    console.error("MB Way payment error:", error);

    if (error instanceof EuPagoError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
