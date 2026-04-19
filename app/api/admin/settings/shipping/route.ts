import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

type ZoneRow = {
  id: number;
  code: string;
  name: string;
  postal_code_start: number;
  postal_code_end: number;
  free_shipping_threshold_cents: number | null;
  is_active: boolean;
};

type RateRow = {
  zone_id: number;
  base_rate_cents: number;
  shipping_classes: { carrier_name: string | null } | Array<{ carrier_name: string | null }> | null;
};

type ClassRow = {
  name: string;
  carrier_name: string;
  is_active: boolean;
};

function eurFromCents(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value === 0) return "Grátis";
  return `€ ${(value / 100).toFixed(2).replace(".", ",")}`;
}

export async function GET() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();
    const [zonesResult, ratesResult, classesResult] = await Promise.all([
      supabase
        .from("shipping_zones")
        .select("id, code, name, postal_code_start, postal_code_end, free_shipping_threshold_cents, is_active")
        .order("display_order", { ascending: true }),
      supabase
        .from("shipping_rates")
        .select("zone_id, base_rate_cents, shipping_classes ( carrier_name )")
        .eq("is_active", true),
      supabase
        .from("shipping_classes")
        .select("name, carrier_name, is_active")
        .order("name", { ascending: true }),
    ]);

    if (zonesResult.error) {
      return NextResponse.json({ success: false, error: zonesResult.error.message }, { status: 500 });
    }
    if (ratesResult.error) {
      return NextResponse.json({ success: false, error: ratesResult.error.message }, { status: 500 });
    }
    if (classesResult.error) {
      return NextResponse.json({ success: false, error: classesResult.error.message }, { status: 500 });
    }

    const rates = (ratesResult.data ?? []) as unknown as RateRow[];
    const zones = ((zonesResult.data ?? []) as ZoneRow[]).map((zone) => {
      const zoneRates = rates.filter((rate) => rate.zone_id === zone.id);
      const carrierNames = new Set(zoneRates.flatMap((rate) => {
        const cls = Array.isArray(rate.shipping_classes) ? rate.shipping_classes[0] : rate.shipping_classes;
        return cls?.carrier_name ? [cls.carrier_name] : [];
      }));
      const minRate = zoneRates.length ? Math.min(...zoneRates.map((rate) => rate.base_rate_cents)) : null;
      return {
        id: zone.code,
        name: zone.name,
        postal: `${zone.postal_code_start}–${zone.postal_code_end}`,
        carriers: carrierNames.size,
        rate: eurFromCents(minRate),
        free: zone.free_shipping_threshold_cents ? `≥ ${eurFromCents(zone.free_shipping_threshold_cents)}` : "—",
        enabled: zone.is_active,
      };
    });

    const carriers = ((classesResult.data ?? []) as ClassRow[]).map((shippingClass) => ({
      name: shippingClass.carrier_name,
      srv: shippingClass.name,
      zones: "Zonas ativas",
      status: shippingClass.is_active ? "Ativo" : "Inativo",
    }));

    return NextResponse.json({ success: true, data: { zones, carriers } });
  } catch (error) {
    console.error("[GET /api/admin/settings/shipping] unexpected:", error);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
