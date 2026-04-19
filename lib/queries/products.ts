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

// PLP + search. Uses the `search_products` RPC that already exists in Supabase.
export async function listProducts(
  params: ListProductsParams = {}
): Promise<UIProductCard[]> {
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
    return [];
  }

  return (data ?? []).map((r: SearchProductRow) => toUIProductFromSearch(r));
}

// Homepage featured strip. Reads is_featured on the template, shows the default variant.
export async function listFeaturedProducts(
  limit = 8
): Promise<UIProductCard[]> {
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
    return [];
  }

  return (data ?? []).map((row) =>
    toUIProductFromVariant(row as unknown as VariantJoinRow)
  );
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
