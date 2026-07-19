// Canonical server-side pricing (F-04). The server DETERMINES every monetary
// value; client-submitted prices are only compared for UX ("cart is stale").
// All arithmetic in integer cents to avoid float drift.

export interface PriceTierRow {
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: number; // euros, VAT included (matches price_tiers schema)
}

export class PricingConfigError extends Error {}

export function toCents(euros: number): number {
  return Math.round(euros * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

// Deterministic tier selection: among tiers whose [min_quantity, max_quantity]
// range contains qty, pick the one with the highest min_quantity. Two
// applicable tiers with the same min_quantity is a configuration error, not a
// choice the client gets to make.
export function selectTier(tiers: PriceTierRow[], quantity: number): PriceTierRow | null {
  const applicable = tiers.filter(
    (t) =>
      quantity >= t.min_quantity &&
      (t.max_quantity === null || t.max_quantity === undefined || quantity <= t.max_quantity)
  );
  if (applicable.length === 0) return null;
  applicable.sort((a, b) => b.min_quantity - a.min_quantity);
  if (applicable.length > 1 && applicable[0].min_quantity === applicable[1].min_quantity) {
    throw new PricingConfigError(
      `Overlapping price tiers at min_quantity=${applicable[0].min_quantity}`
    );
  }
  return applicable[0];
}

// Unit price in cents for a variant at a given quantity.
export function unitPriceCents(
  basePriceEuros: number,
  tiers: PriceTierRow[],
  quantity: number
): number {
  const tier = selectTier(tiers, quantity);
  return toCents(tier ? tier.price_per_unit : basePriceEuros);
}

export interface PricedLine {
  variantId: number;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface OrderPricing {
  lines: PricedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export function priceOrder(
  items: Array<{
    variantId: number;
    quantity: number;
    basePriceEuros: number;
    tiers: PriceTierRow[];
  }>,
  shippingCents: number
): OrderPricing {
  const lines: PricedLine[] = items.map((item) => {
    const unit = unitPriceCents(item.basePriceEuros, item.tiers, item.quantity);
    return {
      variantId: item.variantId,
      quantity: item.quantity,
      unitPriceCents: unit,
      lineTotalCents: unit * item.quantity,
    };
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  return { lines, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
