import { describe, expect, test } from "bun:test";
import {
  selectTier,
  unitPriceCents,
  priceOrder,
  toCents,
  PricingConfigError,
  type PriceTierRow,
} from "../lib/pricing";

const TIERS: PriceTierRow[] = [
  { min_quantity: 10, max_quantity: 49, price_per_unit: 9.0 },
  { min_quantity: 50, max_quantity: 99, price_per_unit: 8.0 },
  { min_quantity: 100, max_quantity: null, price_per_unit: 7.0 },
];

describe("selectTier", () => {
  test("no tiers → null (base price applies)", () => {
    expect(selectTier([], 10)).toBeNull();
  });

  test("below lowest min → null", () => {
    expect(selectTier(TIERS, 9)).toBeNull();
  });

  test("inclusive lower bound", () => {
    expect(selectTier(TIERS, 10)?.price_per_unit).toBe(9.0);
  });

  test("inclusive upper bound", () => {
    expect(selectTier(TIERS, 49)?.price_per_unit).toBe(9.0);
    expect(selectTier(TIERS, 50)?.price_per_unit).toBe(8.0);
  });

  test("max_quantity null is open-ended", () => {
    expect(selectTier(TIERS, 100)?.price_per_unit).toBe(7.0);
    expect(selectTier(TIERS, 100000)?.price_per_unit).toBe(7.0);
  });

  test("overlapping ranges pick highest min_quantity deterministically", () => {
    const overlapping: PriceTierRow[] = [
      { min_quantity: 10, max_quantity: null, price_per_unit: 9.0 },
      { min_quantity: 50, max_quantity: null, price_per_unit: 8.0 },
    ];
    expect(selectTier(overlapping, 60)?.price_per_unit).toBe(8.0);
  });

  test("duplicate min_quantity is a configuration error, not a client choice", () => {
    const dup: PriceTierRow[] = [
      { min_quantity: 10, max_quantity: null, price_per_unit: 9.0 },
      { min_quantity: 10, max_quantity: null, price_per_unit: 5.0 },
    ];
    expect(() => selectTier(dup, 10)).toThrow(PricingConfigError);
  });
});

describe("unitPriceCents", () => {
  test("uses base price when no tier applies", () => {
    expect(unitPriceCents(12.34, [], 5)).toBe(1234);
    expect(unitPriceCents(12.34, TIERS, 5)).toBe(1234);
  });

  test("uses tier price when a tier applies", () => {
    expect(unitPriceCents(12.34, TIERS, 50)).toBe(800);
  });

  test("float-unsafe base prices round to exact cents", () => {
    // 19.9 * 100 = 1989.9999... in floats; must still be 1990
    expect(unitPriceCents(19.9, [], 1)).toBe(1990);
  });
});

describe("priceOrder", () => {
  test("subtotal and total are exact integer-cent sums", () => {
    const pricing = priceOrder(
      [
        { variantId: 1, quantity: 3, basePriceEuros: 19.9, tiers: [] },
        { variantId: 2, quantity: 10, basePriceEuros: 12.0, tiers: TIERS },
      ],
      toCents(4.9)
    );
    // line 1: 1990 × 3 = 5970 · line 2: tier 9.00 → 900 × 10 = 9000
    expect(pricing.lines[0].lineTotalCents).toBe(5970);
    expect(pricing.lines[1].unitPriceCents).toBe(900);
    expect(pricing.subtotalCents).toBe(14970);
    expect(pricing.totalCents).toBe(14970 + 490);
  });

  test("business rule the server must never accept: a client-scaled sibling price", () => {
    // PDP used to scale the slug variant's tier proportionally to siblings.
    // Sibling (base 24.0, no own tiers) at qty 10 must price at BASE, not at
    // a scaled 9.0×(24/12)=18.0 — the server derives 2400, full stop.
    expect(unitPriceCents(24.0, [], 10)).toBe(2400);
  });
});
