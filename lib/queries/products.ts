import { createClient } from "@/lib/supabase/server";
import {
  toUIProductFromSearch,
  toUIProductFromVariant,
  type UIProductCard,
  type SearchProductRow,
  type VariantJoinRow,
} from "@/lib/adapters/product-adapter";

export type ListProductsParams = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryIds?: (string | number)[];
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
  limit?: number;
};

// Result wrapper so callers can distinguish a genuine "no results" (error: false,
// empty products) from a fetch failure (error: true). The happy path is unchanged;
// error is only true when the primary data fetch fails.
export type ProductListResult = { products: UIProductCard[]; error: boolean };

// PLP + search. Uses the `search_products` RPC that already exists in Supabase.
// Thin wrapper preserving the original array return for existing callers.
export async function listProducts(
  params: ListProductsParams = {}
): Promise<UIProductCard[]> {
  return (await listProductsResult(params)).products;
}

// Same query as listProducts, but returns a distinguishable fetch-error signal.
export async function listProductsResult(
  params: ListProductsParams = {}
): Promise<ProductListResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_products", {
    search_term: params.search ?? null,
    min_price: params.minPrice ?? null,
    max_price: params.maxPrice ?? null,
    category_ids: params.categoryIds?.length
      ? params.categoryIds.map((id) => Number(id))
      : null,
    sort_by: params.sort ?? "relevance",
    result_limit: params.limit ?? 100,
  });

  if (error) {
    console.error("[listProducts] RPC error:", error.message);
    return { products: [], error: true };
  }

  const rows: UIProductCard[] = (data ?? []).map((r: SearchProductRow) =>
    toUIProductFromSearch(r)
  );
  if (rows.length === 0) return { products: rows, error: false };

  // Follow-up join: search_products RPC does NOT expose sku or material.
  // Pull both via one batched query keyed on variant_id.
  const variantIds = rows.map((r: UIProductCard) => Number(r.id));
  const { data: meta, error: metaErr } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      sku,
      product_templates!inner (
        material:materials!product_templates_material_id_fkey ( name )
      )
      `
    )
    .in("id", variantIds);

  if (metaErr) {
    // Partial success: we still have products from the RPC; only the metadata
    // enrichment failed. Not treated as a fetch error for the UI.
    console.error("[listProducts] meta-join error:", metaErr.message);
    return { products: rows, error: false };
  }

  type MetaRow = {
    id: number;
    sku: string | null;
    product_templates?: { material?: { name: string | null } | null } | null;
  };

  const byId = new Map<number, { sku: string; material: string }>();
  for (const m of (meta ?? []) as unknown as MetaRow[]) {
    byId.set(m.id, {
      sku: m.sku ?? "",
      material: m.product_templates?.material?.name ?? "",
    });
  }

  const enriched = rows.map((r) => {
    const fill = byId.get(Number(r.id));
    return fill ? { ...r, sku: fill.sku || r.sku, material: fill.material } : r;
  });
  return { products: enriched, error: false };
}

// Homepage featured strip. Reads is_featured on the template, shows the default variant.
// Thin wrapper preserving the original array return for existing callers.
export async function listFeaturedProducts(
  limit = 8
): Promise<UIProductCard[]> {
  return (await listFeaturedProductsResult(limit)).products;
}

// Same query as listFeaturedProducts, but returns a distinguishable fetch-error signal.
export async function listFeaturedProductsResult(
  limit = 8
): Promise<ProductListResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      sku,
      url_slug,
      base_price_including_vat,
      main_image_url,
      stock_status,
      is_bestseller,
      display_order,
      product_templates!inner (
        id,
        name,
        slug,
        is_featured,
        categories:categories!product_templates_category_id_fkey ( id, name, slug ),
        material:materials!product_templates_material_id_fkey ( id, name )
      ),
      size_formats ( name, width_mm, height_mm )
      `
    )
    .eq("is_active", true)
    .eq("product_templates.is_featured", true)
    .eq("product_templates.is_active", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[listFeaturedProducts] error:", error.message);
    return { products: [], error: true };
  }

  const products = (data ?? []).map((row) =>
    toUIProductFromVariant(row as unknown as VariantJoinRow)
  );
  return { products, error: false };
}

export type UICategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
};

export async function listCategories(): Promise<UICategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("[listCategories] error:", error.message);
    return [];
  }

  return (data ?? []).map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description,
  }));
}

// listCategories + per-category active product count in one round-trip.
export async function listCategoriesWithCounts(): Promise<UICategory[]> {
  const supabase = await createClient();
  const cats = await listCategories();
  if (cats.length === 0) return [];

  const counts = await Promise.all(
    cats.map(async (c) => {
      const { count } = await supabase
        .from("product_templates")
        .select("id", { count: "exact", head: true })
        .eq("category_id", Number(c.id))
        .eq("is_active", true);
      return { id: c.id, n: count ?? 0 };
    })
  );

  const byId = new Map(counts.map((r) => [r.id, r.n]));
  return cats.map((c) => ({ ...c, productCount: byId.get(c.id) ?? 0 }));
}

export async function getCategoryBySlug(slug: string): Promise<UICategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getCategoryBySlug] error:", error.message);
    return null;
  }
  if (!data) return null;
  return {
    id: String(data.id),
    name: data.name,
    slug: data.slug,
    description: data.description,
  };
}
