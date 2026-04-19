import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

const ORDER_STATUSES = ["pending", "paid", "prep", "shipped", "delivered", "returned"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const patchOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

// PATCH — update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const orderId = Number(id);
  if (isNaN(orderId)) {
    return NextResponse.json(
      { success: false, error: "ID inválido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parse = patchOrderSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Estado inválido",
          details: parse.error.flatten().fieldErrors,
          allowed: ORDER_STATUSES,
        },
        { status: 400 }
      );
    }

    const { status } = parse.data;
    const supabase = createAdminClient();

    // Fetch current order to check paid_at
    const { data: current, error: fetchErr } = await supabase
      .from("orders")
      .select("id, paid_at, status")
      .eq("id", orderId)
      .single();

    if (fetchErr || !current) {
      return NextResponse.json(
        { success: false, error: "Encomenda não encontrada" },
        { status: 404 }
      );
    }

    // Statuses that indicate payment received
    const paidStatuses: OrderStatus[] = ["paid", "prep", "shipped", "delivered"];
    const isPaidTransition = paidStatuses.includes(status);
    const needsPaidAt = isPaidTransition && !current.paid_at;

    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (needsPaidAt) {
      updatePayload.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/admin/orders/[id]] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[PATCH /api/admin/orders/[id]] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
