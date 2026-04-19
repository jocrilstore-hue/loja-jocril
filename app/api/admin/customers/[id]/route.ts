import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

type OrderRow = {
  order_number: string;
  status: string;
  payment_status: string;
  total_amount_with_vat: number | string;
  created_at: string;
  item_count: Array<{ count: number }>;
};

type AddressRow = {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  postal_code: string | null;
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

function fullName(customer: CustomerRow) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ");
}

function displayName(customer: CustomerRow) {
  return customer.company_name || fullName(customer) || customer.email;
}

function formatMoney(value: number) {
  return `€ ${value.toFixed(2).replace(".", ",")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

function tierFor(spent: number, orders: number) {
  if (spent >= 1000 || orders >= 10) return "10+";
  if (spent >= 500 || orders >= 5) return "5+";
  if (orders > 0) return "1+";
  return "new";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isFinite(customerId)) {
    return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .select(
        `
        id, first_name, last_name, email, phone, company_name, tax_id, created_at,
        orders (
          order_number, status, payment_status, total_amount_with_vat, created_at,
          item_count:order_items ( count )
        ),
        shipping_addresses ( address_line_1, address_line_2, city, postal_code, country )
        `
      )
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Cliente não encontrado" }, { status: 404 });
    }

    const customer = data as unknown as CustomerRow;
    const orders = [...(customer.orders ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const spent = orders.reduce((sum, order) => sum + Number(order.total_amount_with_vat ?? 0), 0);
    const average = orders.length ? spent / orders.length : 0;
    const recent90 = orders
      .filter((order) => Date.now() - new Date(order.created_at).getTime() <= 90 * 24 * 60 * 60 * 1000)
      .reduce((sum, order) => sum + Number(order.total_amount_with_vat ?? 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        n: displayName(customer),
        e: customer.email,
        p: customer.phone ?? "—",
        nif: customer.tax_id ?? "—",
        type: customer.company_name ? "B2B" : "B2C",
        since: new Date(customer.created_at).toLocaleDateString("pt-PT", { month: "long", year: "numeric" }),
        tier: tierFor(spent, orders.length),
        addr: (customer.shipping_addresses ?? []).map((address) => [
          address.address_line_1,
          address.address_line_2,
          [address.postal_code, address.city].filter(Boolean).join(" "),
          address.country,
        ].filter(Boolean)),
        notes: customer.company_name
          ? `Empresa: ${customer.company_name}${customer.tax_id ? ` · NIF ${customer.tax_id}` : ""}`
          : customer.tax_id ? `NIF ${customer.tax_id}` : "Sem notas internas registadas.",
        kpis: [
          ["Encomendas", String(orders.length)],
          ["Valor total", formatMoney(spent)],
          ["Ticket médio", formatMoney(average)],
          ["Últimos 90d", formatMoney(recent90)],
        ] as [string, string][],
        orders: orders.map((order) => ({
          n: order.order_number,
          d: formatDate(order.created_at),
          it: order.item_count?.[0]?.count ?? 0,
          v: formatMoney(Number(order.total_amount_with_vat ?? 0)),
          s: order.payment_status === "paid" ? "paid" : order.status,
        })),
        activity: orders.slice(0, 4).map((order) => ({
          d: formatDate(order.created_at),
          l: `Encomenda ${order.order_number} · ${formatMoney(Number(order.total_amount_with_vat ?? 0))}`,
        })),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/customers/[id]] unexpected:", err);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
