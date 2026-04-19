"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminShell";
import { adminDanger, adminGhost } from "@/components/admin/styles";

type OrderStatus = "pending" | "paid" | "prep" | "shipped" | "delivered" | "returned";

type ApiOrderItem = {
  id: number;
  product_name: string | null;
  product_sku: string | null;
  size_format: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type ApiCustomer = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  tax_id: string | null;
};

type ApiShippingAddress = {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
};

type ApiOrder = {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  notes: string | null;
  subtotal_including_vat: number | null;
  shipping_cost_including_vat: number | null;
  total_amount_with_vat: number | null;
  created_at: string;
  updated_at: string | null;
  paid_at: string | null;
  payment_deadline: string | null;
  eupago_entity: string | null;
  eupago_reference: string | null;
  eupago_transaction_id: string | null;
  customer: ApiCustomer | ApiCustomer[] | null;
  shipping_address: ApiShippingAddress | ApiShippingAddress[] | null;
  items: ApiOrderItem[];
};

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "A aguardar" },
  { value: "paid", label: "Paga" },
  { value: "prep", label: "Em preparação" },
  { value: "shipped", label: "Expedida" },
  { value: "delivered", label: "Entregue" },
  { value: "returned", label: "Devolvida" },
];

const DB_STATUS_MAP: Record<string, OrderStatus> = {
  pending: "pending",
  confirmed: "paid",
  paid: "paid",
  processing: "prep",
  preparation: "prep",
  prep: "prep",
  shipped: "shipped",
  delivered: "delivered",
  returned: "returned",
  cancelled: "returned",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "var(--color-base-500)",
  paid: "var(--color-accent-300)",
  prep: "var(--color-accent-100)",
  shipped: "var(--color-secondary)",
  delivered: "var(--color-base-300)",
  returned: "var(--color-destructive)",
};

function Tag({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <span className="text-mono-xs" style={{ padding: "4px 10px", border: "1px dashed var(--color-base-800)", borderRadius: 2, color: muted ? "var(--color-base-500)" : "var(--color-accent-300)", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function toAdminStatus(status: string): OrderStatus {
  return DB_STATUS_MAP[status] ?? "pending";
}

function statusLabel(status: OrderStatus) {
  return ORDER_STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

function money(value: number | null | undefined) {
  return `€ ${(value ?? 0).toFixed(2).replace(".", ",")}`;
}

function dateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return `${date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })} · ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
}

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function customerName(customer: ApiCustomer | null) {
  if (!customer) return "—";
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.company_name || customer.email || "—";
}

function disabledStyle(base: CSSProperties): CSSProperties {
  return { ...base, opacity: 0.55, cursor: "not-allowed" };
}

export default function AdminEncomendaDetailPage() {
  const params = useParams();
  const orderId = params?.id ? String(params.id) : null;
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("pending");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const controller = new AbortController();

    async function loadOrder() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, { signal: controller.signal });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "Erro ao carregar encomenda");
        }
        const nextOrder = json.data as ApiOrder;
        setOrder(nextOrder);
        setCurrentStatus(toAdminStatus(nextOrder.status));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Erro ao carregar encomenda");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
    return () => controller.abort();
  }, [orderId]);

  const customer = one(order?.customer ?? null);
  const shipping = one(order?.shipping_address ?? null);
  const items = order?.items ?? [];
  const subtotal = order?.subtotal_including_vat ?? items.reduce((sum, item) => sum + item.total_price, 0);
  const shippingCost = order?.shipping_cost_including_vat ?? 0;
  const total = order?.total_amount_with_vat ?? subtotal + shippingCost;

  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const timeline = useMemo(() => {
    const status = currentStatus;
    const paid = !!order?.paid_at || order?.payment_status === "paid" || ["paid", "prep", "shipped", "delivered"].includes(status);
    const prep = ["prep", "shipped", "delivered"].includes(status);
    const shipped = ["shipped", "delivered"].includes(status);
    const delivered = status === "delivered";

    return [
      { label: "Encomenda criada", date: dateTime(order?.created_at), who: "Sistema", done: true, active: status === "pending" },
      { label: "Pagamento recebido", date: paid ? dateTime(order?.paid_at ?? order?.updated_at) : "—", who: paid ? "Sistema" : "—", done: paid, active: status === "paid" },
      { label: "Em preparação", date: prep ? dateTime(order?.updated_at) : "—", who: prep ? "Staff" : "—", done: prep, active: status === "prep" },
      { label: "Expedida", date: shipped ? dateTime(order?.updated_at) : "—", who: shipped ? "Staff" : "—", done: shipped, active: status === "shipped" },
      { label: "Entregue", date: delivered ? dateTime(order?.updated_at) : "—", who: delivered ? "Staff" : "—", done: delivered, active: status === "delivered" },
    ];
  }, [currentStatus, order]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!orderId || statusSaving) return;
    setStatusSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setCurrentStatus(newStatus);
        setOrder((prev) => prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : prev);
        setStatusMsg({ ok: true, text: "Estado atualizado" });
      } else {
        setStatusMsg({ ok: false, text: json.error ?? "Erro ao atualizar" });
      }
    } catch {
      setStatusMsg({ ok: false, text: "Erro de ligação ao servidor" });
    } finally {
      setStatusSaving(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <AdminShell active="orders" breadcrumbs={["Encomendas", order?.order_number ?? orderId ?? "Detalhe"]}>
      {loading && (
        <AdminCard title="Encomenda" padded>
          <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>A carregar encomenda…</span>
        </AdminCard>
      )}

      {!loading && error && (
        <AdminCard title="Encomenda" padded>
          <span className="text-mono-xs" style={{ color: "var(--color-destructive)" }}>{error}</span>
        </AdminCard>
      )}

      {!loading && !error && order && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
            <div>
              <div className="text-mono-xs" style={{ color: STATUS_COLOR[currentStatus] }}>
                ● Encomenda · {statusLabel(currentStatus)}
              </div>
              <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-geist-sans)", fontSize: 40, letterSpacing: "-.045em", color: "var(--color-light-base-primary)" }}>{order.order_number}</h1>
              <div style={{ marginTop: 10, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Tag>● {statusLabel(currentStatus)}</Tag>
                <Tag muted>Criada · {dateTime(order.created_at)}</Tag>
                <Tag muted>{items.length} artigos · {totalUnits} unidades</Tag>
                <Tag muted>Cliente · {customerName(customer)}</Tag>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {statusMsg && (
                <span className="text-mono-xs" style={{ color: statusMsg.ok ? "var(--color-accent-300)" : "var(--color-destructive)" }}>
                  {statusMsg.ok ? "✓ " : ""}{statusMsg.text}
                </span>
              )}
              <select
                value={currentStatus}
                onChange={(e) => updateStatus(e.target.value as OrderStatus)}
                disabled={statusSaving}
                aria-label="Estado da encomenda"
                style={{ padding: "9px 12px", background: "var(--color-dark-base-secondary)", border: "1px solid var(--color-base-800)", borderRadius: 2, color: "var(--color-base-300)", fontFamily: "var(--font-geist-mono)", fontSize: 12, cursor: "pointer" }}
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button disabled title="Faturação ainda não está ligada" style={disabledStyle(adminGhost)}>Imprimir fatura</button>
              <button disabled title="Guias de transporte ainda não estão ligadas" style={disabledStyle(adminGhost)}>Imprimir guia</button>
              <button disabled title="Cancelamento manual ainda não está ligado" style={disabledStyle(adminDanger)}>Cancelar</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
            <div style={{ display: "grid", gap: 14 }}>
              <AdminCard title={`Artigos (${items.length})`}>
                <div style={{ display: "grid", gridTemplateColumns: "64px 1.6fr auto auto auto", gap: 14, padding: "10px 18px", borderBottom: "1px dashed var(--color-base-800)" }}>
                  {["", "Produto", "Qtd", "Unit.", "Total"].map(h => <span key={h} className="text-mono-xs" style={{ color: "var(--color-base-500)", textTransform: "uppercase" }}>{h}</span>)}
                </div>
                {items.map((item, index) => (
                  <div key={item.id} style={{ display: "grid", gridTemplateColumns: "64px 1.6fr auto auto auto", gap: 14, padding: 18, alignItems: "center", borderBottom: index < items.length - 1 ? "1px dashed var(--color-base-900)" : "none" }}>
                    <div style={{ aspectRatio: "1/1", background: "var(--color-dark-base-primary)", border: "1px solid var(--color-base-800)", borderRadius: 2 }}/>
                    <div>
                      <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)", letterSpacing: "-.02em" }}>{item.product_name ?? "Produto"}</div>
                      <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 3 }}>{item.product_sku ? `SKU ${item.product_sku}` : "SKU —"}</div>
                      {item.size_format && <div className="text-mono-xs" style={{ color: "var(--color-base-600)", marginTop: 3 }}>{item.size_format}</div>}
                    </div>
                    <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>× {item.quantity}</span>
                    <span className="text-mono-xs" style={{ color: "var(--color-base-400)" }}>{money(item.unit_price)}</span>
                    <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-light-base-primary)" }}>{money(item.total_price)}</span>
                  </div>
                ))}
                <div style={{ padding: 18, borderTop: "1px dashed var(--color-base-800)", display: "grid", gap: 6 }}>
                  {[
                    ["Subtotal", money(subtotal)],
                    ["Envio", money(shippingCost)],
                    ["IVA incluído (23%)", "—"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{label}</span>
                      <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--color-base-300)" }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: "1px dashed var(--color-base-800)" }}>
                    <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 17, color: "var(--color-light-base-primary)" }}>Total</span>
                    <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 24, color: "var(--color-light-base-primary)", letterSpacing: "-.03em" }}>{money(total)}</span>
                  </div>
                </div>
              </AdminCard>

              <AdminCard title="Cronologia" padded>
                <div style={{ display: "grid", gap: 0 }}>
                  {timeline.map((item, index) => (
                    <div key={item.label} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 14, padding: "10px 0", alignItems: "center" }}>
                      <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
                        <div style={{ width: 12, height: 12, borderRadius: 7, background: item.active ? "var(--color-accent-100)" : "var(--color-dark-base-secondary)", border: `1.5px solid ${item.done ? "var(--color-accent-100)" : "var(--color-base-700)"}`, boxShadow: item.active ? "0 0 0 4px rgba(45,212,205,.18)" : "none" }}/>
                        {index < timeline.length - 1 && <div style={{ position: "absolute", top: 18, width: 1, height: 20, borderLeft: `1px dashed ${item.done ? "var(--color-accent-100)" : "var(--color-base-800)"}` }}/>}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: item.done ? "var(--color-light-base-primary)" : "var(--color-base-500)" }}>{item.label}</div>
                        <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>{item.date} · {item.who}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard title="Notas da encomenda" padded>
                <p style={{ margin: 0, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: order.notes ? "var(--color-base-300)" : "var(--color-base-600)", lineHeight: 1.6 }}>
                  {order.notes || "Sem notas registadas nesta encomenda."}
                </p>
              </AdminCard>
            </div>

            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <AdminCard title="Cliente" padded>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--color-accent-100)", color: "var(--color-dark-base-primary)", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono)", fontSize: 14 }}>
                    {customerName(customer).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--color-light-base-primary)" }}>{customerName(customer)}</div>
                    <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{customer?.email ?? "—"}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 12, borderTop: "1px dashed var(--color-base-800)" }}>
                  {[
                    ["Telefone", customer?.phone ?? "—"],
                    ["NIF", customer?.tax_id ?? "—"],
                    ["Empresa", customer?.company_name ?? "—"],
                    ["Cliente ID", customer?.id ? String(customer.id) : "—"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>{label}</div>
                      <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", marginTop: 3 }}>{value}</div>
                    </div>
                  ))}
                </div>
                {customer?.id && (
                  <Link href={`/admin/clientes/${customer.id}`} style={{ marginTop: 12, display: "block", fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--color-accent-100)", paddingTop: 12, borderTop: "1px dashed var(--color-base-800)", textDecoration: "none" }}>Ver perfil do cliente →</Link>
                )}
              </AdminCard>

              <AdminCard title="Entrega" padded>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", lineHeight: 1.6 }}>
                  {shipping?.address_line_1 && <div>{shipping.address_line_1}</div>}
                  {shipping?.address_line_2 && <div>{shipping.address_line_2}</div>}
                  {(shipping?.postal_code || shipping?.city) && <div>{shipping?.postal_code} {shipping?.city}</div>}
                  {shipping?.country && <div>{shipping.country}</div>}
                  {!shipping && <div style={{ color: "var(--color-base-600)" }}>Sem morada registada.</div>}
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--color-base-800)" }}>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Expedição</div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-base-400)", marginTop: 3 }}>Tracking ainda não registado.</div>
                </div>
              </AdminCard>

              <AdminCard title="Faturação" padded>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)", lineHeight: 1.6 }}>
                  <div>{customerName(customer)}</div>
                  {customer?.company_name && <div>{customer.company_name}</div>}
                  {customer?.tax_id && <div><span className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>NIF</span> {customer.tax_id}</div>}
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--color-base-800)", display: "grid", gap: 4 }}>
                  <div className="text-mono-xs" style={{ color: "var(--color-base-500)" }}>Pagamento</div>
                  <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--color-light-base-primary)" }}>{order.payment_method ?? "—"}</div>
                  <div className="text-mono-xs" style={{ color: order.payment_status === "paid" ? "var(--color-accent-300)" : "var(--color-base-500)", marginTop: 3 }}>● {order.payment_status}</div>
                  {order.eupago_reference && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>Ref. {order.eupago_reference}</div>}
                  {order.eupago_entity && <div className="text-mono-xs" style={{ color: "var(--color-base-500)", marginTop: 2 }}>Entidade {order.eupago_entity}</div>}
                </div>
              </AdminCard>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
