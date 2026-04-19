import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

type Trend = "up" | "down" | "flat";

type CustomerRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

type OrderRow = {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount_with_vat: number | string;
  created_at: string;
  customer: CustomerRow | CustomerRow[] | null;
  item_count: Array<{ count: number }>;
};

type OrderItemRow = {
  product_name: string | null;
  product_sku: string | null;
  quantity: number;
  line_total_with_vat: number | string;
};

type VariantRow = {
  sku: string | null;
  stock_quantity: number | null;
  product_templates: { name: string | null } | Array<{ name: string | null }> | null;
};

function formatMoney(value: number) {
  return `€ ${value.toFixed(2).replace(".", ",")}`;
}

function customerName(customer: OrderRow["customer"]) {
  const row = Array.isArray(customer) ? customer[0] : customer;
  if (!row) return "—";
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ");
  return name || row.email || "—";
}

function itemCount(order: OrderRow) {
  return order.item_count?.[0]?.count ?? 0;
}

function daysAgoLabel(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes || 1} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h atrás`;
  return `${Math.floor(hours / 24)} d atrás`;
}

function buildSpark(orders: OrderRow[]) {
  const days = Array.from({ length: 14 }, (_, idx) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (13 - idx));
    return { key: day.toISOString().slice(0, 10), total: 0 };
  });
  const byDay = new Map(days.map((day) => [day.key, day]));
  for (const order of orders) {
    const key = new Date(order.created_at).toISOString().slice(0, 10);
    const day = byDay.get(key);
    if (day) day.total += Number(order.total_amount_with_vat ?? 0);
  }
  return days.map((day) => Math.round(day.total));
}

export async function GET() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 30);

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        id, order_number, status, payment_status, total_amount_with_vat, created_at,
        customer:customers ( first_name, last_name, email ),
        item_count:order_items ( count )
        `
      )
      .gte("created_at", monthStart.toISOString())
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("[GET /api/admin/stats] orders error:", ordersError);
      return NextResponse.json({ success: false, error: ordersError.message }, { status: 500 });
    }

    const orders = (ordersData ?? []) as unknown as OrderRow[];
    const todayOrders = orders.filter((order) => new Date(order.created_at) >= todayStart);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total_amount_with_vat ?? 0), 0);
    const monthRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount_with_vat ?? 0), 0);
    const avgTicket = orders.length ? monthRevenue / orders.length : 0;
    const pendingDispatch = orders.filter((order) => ["paid", "confirmed", "processing"].includes(order.payment_status) || ["confirmed", "processing"].includes(order.status)).length;
    const spark = buildSpark(orders);

    const orderIds = orders.map((order) => order.id);
    const { data: itemsData } = orderIds.length
      ? await supabase
        .from("order_items")
        .select("product_name, product_sku, quantity, line_total_with_vat")
        .in("order_id", orderIds)
      : { data: [] };
    const items = (itemsData ?? []) as unknown as OrderItemRow[];

    const topBySku = new Map<string, { n: string; sold: number; rev: number; img: string }>();
    for (const item of items) {
      const key = item.product_sku || item.product_name || "—";
      const current = topBySku.get(key) ?? { n: item.product_name || key, sold: 0, rev: 0, img: "/assets/placeholder.svg" };
      current.sold += Number(item.quantity ?? 0);
      current.rev += Number(item.line_total_with_vat ?? 0);
      topBySku.set(key, current);
    }

    const { data: lowStockData } = await supabase
      .from("product_variants")
      .select("sku, stock_quantity, product_templates ( name )")
      .lte("stock_quantity", 9)
      .order("stock_quantity", { ascending: true })
      .limit(8);
    const lowStockRows = (lowStockData ?? []) as unknown as VariantRow[];

    const kpis: { k: string; v: string; d: string; trend: Trend; spark: number[] }[] = [
      { k: "Vendas hoje", v: formatMoney(todayRevenue), d: `${todayOrders.length} encomenda(s) hoje`, trend: todayRevenue > 0 ? "up" : "flat", spark },
      { k: "Encomendas", v: String(todayOrders.length), d: `${pendingDispatch} por preparar`, trend: pendingDispatch > 0 ? "flat" : "up", spark: spark.map((v) => Math.max(0, Math.round(v / 100))) },
      { k: "Ticket médio", v: formatMoney(avgTicket), d: "últimos 30 dias", trend: "flat", spark },
      { k: "Stock crítico", v: `${lowStockRows.length} SKUs`, d: "< 10 unid. disp.", trend: lowStockRows.length > 0 ? "down" : "flat", spark: lowStockRows.map((row) => Number(row.stock_quantity ?? 0)).concat([0, 0, 0]).slice(0, 14) },
    ];

    const recent = orders.slice(0, 8).map((order) => ({
      n: order.order_number,
      c: customerName(order.customer),
      it: itemCount(order),
      v: formatMoney(Number(order.total_amount_with_vat ?? 0)),
      s: order.payment_status === "paid" ? "paid" : order.status,
      t: daysAgoLabel(order.created_at),
    }));

    const topProds = Array.from(topBySku.values())
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 4)
      .map((product) => ({ ...product, rev: formatMoney(product.rev) }));

    const lowStock = lowStockRows.map((row) => {
      const template = Array.isArray(row.product_templates) ? row.product_templates[0] : row.product_templates;
      return {
        sku: row.sku ?? "—",
        n: template?.name ?? row.sku ?? "Produto",
        qty: Number(row.stock_quantity ?? 0),
        min: 10,
      };
    });

    return NextResponse.json({
      success: true,
      data: { kpis, recent, topProds, lowStock },
    });
  } catch (err) {
    console.error("[GET /api/admin/stats] unexpected:", err);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
