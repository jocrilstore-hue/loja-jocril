import { createServiceClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { verifyCallback } from "@/lib/payments/eupago";
import { sendPaymentReceived } from "@/lib/email/send";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("EuPago webhook received:", JSON.stringify(body, null, 2));

    const callback = verifyCallback(body);
    if (!callback) {
      console.error("Invalid EuPago callback format");
      // Return 200 to prevent EuPago infinite retries on bad payloads
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 200 }
      );
    }

    const {
      identificador: orderNumber,
      transacao: transactionId,
      valor: amount,
      canal: channel,
      referencia: reference,
    } = callback;

    // Authorization: verifyCallback above is fail-closed on EUPAGO_API_KEY.
    // Service client required once RLS closes anon access to orders.
    const supabase = createServiceClient();

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, payment_status, total_amount_with_vat, customer:customers(first_name, last_name, company_name, email)")
      .eq("order_number", orderNumber)
      .single();

    if (findError || !order) {
      console.error(`Order not found: ${orderNumber}`);
      return NextResponse.json({ success: true, message: "Order not found" });
    }

    if (order.payment_status === "paid") {
      console.log(`Order ${orderNumber} already marked as paid`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    const amountDiff = Math.abs(order.total_amount_with_vat - amount);
    if (amountDiff > 0.01) {
      console.warn(
        `Amount mismatch for ${orderNumber}: expected ${order.total_amount_with_vat}, got ${amount}`
      );
      return NextResponse.json({ error: "amount_mismatch" }, { status: 200 });
    }

    // The guard on payment_status keeps this idempotent under concurrent
    // deliveries; requiring exactly one returned row turns a silent zero-row
    // update (wrong id, race, RLS) into a retryable 500 instead of success.
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "processing",
        paid_at: new Date().toISOString(),
        eupago_transaction_id: transactionId,
      })
      .eq("id", order.id)
      .neq("payment_status", "paid")
      .select("id");

    if (updateError || !updated || updated.length !== 1) {
      if (!updateError && updated && updated.length === 0) {
        // Lost the race to a concurrent delivery that already marked it paid.
        console.log(`Order ${orderNumber} already paid (concurrent callback)`);
        return NextResponse.json({ success: true, message: "Already processed" });
      }
      console.error("Error updating order payment status:", updateError, updated);
      return NextResponse.json(
        { success: false, error: "Failed to update order" },
        { status: 500 }
      );
    }

    console.log(
      `Order ${orderNumber} paid via ${channel}. Reference: ${reference}, Transaction: ${transactionId}`
    );

    // Fire-and-forget payment received email (B7)
    const customerRaw = order.customer as {
      first_name: string | null;
      last_name: string | null;
      company_name: string | null;
      email: string | null;
    } | {
      first_name: string | null;
      last_name: string | null;
      company_name: string | null;
      email: string | null;
    }[] | null;
    const customer = Array.isArray(customerRaw) ? customerRaw[0] ?? null : customerRaw;
    if (customer?.email) {
      const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim();
      sendPaymentReceived({
        orderNumber,
        customerName: fullName || customer.company_name || "Cliente Jocril",
        customerEmail: customer.email,
        total: order.total_amount_with_vat,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed",
    });
  } catch (error) {
    console.error("EuPago webhook error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal error",
    });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "EuPago Webhook",
    timestamp: new Date().toISOString(),
  });
}
