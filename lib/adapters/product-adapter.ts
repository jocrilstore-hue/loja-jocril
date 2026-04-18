// DB shape → UI shape. See lib/adapters/README.md for the pattern.
// UI shape is `ProductMock` (components/store/ProductCard.tsx): compact card data.
// DB shape comes from either:
//   - the `search_products` RPC (normalized flat rows)
//   - direct `product_variants` select joined with `product_templates`, `size_formats`, images

import type { ProductMock } from "@/components/store/ProductCard";

type StockKey = ProductMock["stock"];

export function mapStockStatus(raw: string | null | undefined): StockKey {
  switch ((raw ?? "").toLowerCase()) {
    case "in_stock":
      return "in";
    case "low_stock":
    case "ultimas_unidades":
      return "low";
    case "made_to_order":
    case "production":
    case "producao_por_encomenda":
      return "made";
    default:
      return "made";
  }
}

// Row from `search_products(...)` RPC.
// Matches RETURNS TABLE in migration 20251220200000_improve_search_function.sql.
// NOTE: RPC does NOT expose sku or material — they must be fetched separately
// if the PLP needs to render them. B1c task: decide between extending the RPC
// or doing a follow-up join.
export type SearchProductRow = {
  variant_id: number;
  template_name: string;
  size_name: string | null;
  orientation: string | null;
  category_name: string | null;
  base_price_including_vat: number;
  main_image_url: string | null;
  url_slug: string;
  stock_status: string | null;
  relevance_score: number;
};

// Row from a `product_variants` select joined with template/size_format.
export type VariantJoinRow = {
  id: number;
  sku: string;
  url_slug: string;
  base_price_including_vat: number | string;
  main_image_url: string | null;
  stock_status: string | null;
  is_bestseller?: boolean | null;
  product_templates?: {
    id: number;
    name: string;
    slug?: string | null;
    is_featured?: boolean | null;
    categories?: { id: number; name: string; slug?: string | null } | null;
    material?: { id: number; name: string } | null;
    materials?: { id: number; name: string } | null;
  } | null;
  size_formats?: {
    name?: string | null;
    width_mm?: number | null;
    height_mm?: number | null;
  } | null;
};

// Compose the tiers-display string (e.g. "1+ · 10+ · 100+"). Falls back to "1+".
export function formatTiersLabel(
  tiers: Array<{ min_quantity: number }> | null | undefined
): string {
  if (!tiers || tiers.length === 0) return "1+";
  const mins = Array.from(new Set(tiers.map((t) => t.min_quantity))).sort(
    (a, b) => a - b
  );
  return mins.map((m) => `${m}+`).join(" · ");
}

export function formatDimensions(
  width?: number | null,
  height?: number | null
): string | undefined {
  if (!width || !height) return undefined;
  return `${width} × ${height} mm`;
}

// Search RPC row → ProductMock. Slug included as optional field (consumed by ProductCard).
// sku and material are not in the RPC output — show url_slug as sku placeholder and "" material.
export function toUIProductFromSearch(
  row: SearchProductRow
): ProductMock & { slug: string; id: string } {
  return {
    id: String(row.variant_id),
    slug: row.url_slug,
    sku: row.url_slug.toUpperCase(), // placeholder until RPC exposes sku
    name: row.template_name || "Produto",
    cat: row.category_name ?? "",
    material: "",
    dim: row.size_name ?? undefined,
    from: Number(row.base_price_including_vat ?? 0),
    tiers: "1+",
    img: row.main_image_url || "/assets/placeholder.svg",
    stock: mapStockStatus(row.stock_status),
  };
}

// Variant-join row → ProductMock.
export function toUIProductFromVariant(
  row: VariantJoinRow
): ProductMock & { slug: string; id: string } {
  const tpl = row.product_templates;
  const material =
    (tpl?.material?.name ?? tpl?.materials?.name) ?? "";
  return {
    id: String(row.id),
    slug: row.url_slug,
    sku: row.sku,
    name: tpl?.name || "Produto",
    cat: tpl?.categories?.name ?? "",
    material,
    dim: formatDimensions(row.size_formats?.width_mm, row.size_formats?.height_mm),
    from: Number(row.base_price_including_vat ?? 0),
    tiers: "1+",
    img: row.main_image_url || "/assets/placeholder.svg",
    stock: mapStockStatus(row.stock_status),
  };
}

export type UIProductCard = ProductMock & { slug: string; id: string };
