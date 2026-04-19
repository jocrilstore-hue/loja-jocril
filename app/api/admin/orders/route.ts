import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

export async function GET() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id, order_number, status, payment_status, payment_method,
        total_amount_with_vat, created_at,
        customer:customers ( name, email ),
        item_count:order_items ( count )
        `
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[GET /api/admin/orders] error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[GET /api/admin/orders] unexpected:", err);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
