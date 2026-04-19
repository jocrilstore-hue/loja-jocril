import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

type OrderRow = {
  total_amount_with_vat: number | string;
  created_at: string;
};

type AddressRow = {
  city: string | null;
  country: string | null;
};

type CustomerRow = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
  tax_id: string | null;
  created_at: string;
  orders: OrderRow[];
  shipping_addresses: AddressRow[];
};

function customerName(customer: CustomerRow) {
  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ");
  return customer.company_name || fullName || customer.email;
}

function tierFor(spent: number, orders: number) {
  if (spent >= 1000 || orders >= 10) return "10+";
  if (spent >= 500 || orders >= 5) return "5+";
  if (orders > 0) return "1+";
  return "new";
}

function formatLast(orders: OrderRow[]) {
  if (orders.length === 0) return "—";
  return new Date(orders[0].created_at).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}

export async function GET() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .select(
        `
        id, first_name, last_name, email, phone, company_name, tax_id, created_at,
        orders ( total_amount_with_vat, created_at ),
        shipping_addresses ( city, country )
        `
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[GET /api/admin/customers] error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const customers = ((data ?? []) as unknown as CustomerRow[]).map((customer) => {
      const orders = [...(customer.orders ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const spent = orders.reduce((sum, order) => sum + Number(order.total_amount_with_vat ?? 0), 0);
      const address = customer.shipping_addresses?.[0];
      return {
        id: customer.id,
        e: customer.email,
        n: customerName(customer),
        type: customer.company_name ? "B2B" : "B2C",
        orders: orders.length,
        spent,
        last: formatLast(orders),
        loc: address?.city ?? address?.country ?? "—",
        tier: tierFor(spent, orders.length),
        tax_id: customer.tax_id,
        created_at: customer.created_at,
      };
    });

    return NextResponse.json({ success: true, data: customers });
  } catch (err) {
    console.error("[GET /api/admin/customers] unexpected:", err);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
