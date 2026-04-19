import { createClient } from "@/lib/supabase/server";
import { mapStockStatus } from "@/lib/adapters/product-adapter";
import { listProducts } from "@/lib/queries/products";
import type { ProductMock } from "@/components/store/ProductCard";
import type { PDPProduct } from "@/app/(store)/produtos/[slug]/pdp-client";

const STOCK_LABEL: Record<ReturnType<typeof mapStockStatus>, string> = {
  in: "Em stock",
  low: "Últimas unidades",
  made: "Produção por encomenda",
};

// Fetch PDP data for a given variant url_slug.
// Returns the {product, related} pair the PDP client expects, or null if not found.
export async function getPDPBySlug(
  slug: string
): Promise<{ product: PDPProduct; related: ProductMock[] } | null> {
  const supabase = await createClient();

  // 1. Current variant + template + size_format + category + material
  const { data: current, error: curErr } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      sku,
      url_slug,
      base_price_including_vat,
      stock_quantity,
      stock_status,
      main_image_url,
      product_templates (
        id,
        name,
        short_description,
        category_id,
        categories:categories!product_templates_category_id_fkey ( id, name ),
        material:materials!product_templates_material_id_fkey ( id, name )
      ),
      size_formats ( id, name, code, width_mm, height_mm )
      `
    )
    .eq("url_slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (curErr) {
    console.error("[getPDPBySlug] error:", curErr.message);
    return null;
  }
  if (!current) return null;

  const cur = current as unknown as {
    id: number;
    sku: string;
    url_slug: string;
    base_price_including_vat: number | string;
    stock_quantity: number | null;
    stock_status: string | null;
    main_image_url: string | null;
    product_templates: {
      id: number;
      name: string;
      short_description: string | null;
      category_id: number | null;
      categories?: { id: number; name: string } | null;
      material?: { id: number; name: string } | null;
    };
    size_formats?: {
      id: number;
      name: string;
      code: string | null;
      width_mm: number | null;
      height_mm: number | null;
    } | null;
  };

  const templateId = cur.product_templates.id;
  const categoryId = cur.product_templates.category_id;

  // 2. Sibling variants (same template) — for the size selector
  const { data: siblings } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      sku,
      url_slug,
      base_price_including_vat,
      size_formats ( id, name, code, width_mm, height_mm )
      `
    )
    .eq("product_template_id", templateId)
    .eq("is_active", true);

  // 3. Price tiers for current variant
  const { data: tiers } = await supabase
    .from("price_tiers")
    .select("min_quantity, max_quantity, price_per_unit, discount_percentage")
    .eq("product_variant_id", cur.id)
    .order("min_quantity", { ascending: true });

  // 4. Variant images
  const { data: images } = await supabase
    .from("product_images")
    .select("image_url, display_order")
    .eq("product_variant_id", cur.id)
    .order("display_order", { ascending: true });

  // 5. Template images (main type preferred for hero)
  const { data: templateImages } = await supabase
    .from("product_template_images")
    .select("image_url, image_type, display_order")
    .eq("product_template_id", templateId)
    .order("display_order", { ascending: true });

  // Compose image list: template-main first, then variant images, then any other template imgs.
  const mainTmpl = (templateImages ?? []).find((i) => i.image_type === "main");
  const imgList: string[] = [];
  if (mainTmpl?.image_url) imgList.push(mainTmpl.image_url);
  for (const i of images ?? []) if (i.image_url) imgList.push(i.image_url);
  for (const i of templateImages ?? [])
    if (i.image_type !== "main" && i.image_url) imgList.push(i.image_url);
  if (cur.main_image_url && !imgList.includes(cur.main_image_url))
    imgList.push(cur.main_image_url);
  if (imgList.length === 0) imgList.push("/assets/portfolio/carm-premium.avif");

  // Size variants
  const sizeVariants = (siblings ?? []).map((s) => {
    const sv = s as unknown as {
      id: number;
      sku: string;
      url_slug: string;
      base_price_including_vat: number | string;
      size_formats?: {
        name: string;
        width_mm: number | null;
        height_mm: number | null;
      } | null;
    };
    const dim =
      sv.size_formats?.width_mm && sv.size_formats?.height_mm
        ? `${sv.size_formats.width_mm} × ${sv.size_formats.height_mm} mm`
        : (sv.size_formats?.name ?? "");
    return {
      k: sv.url_slug,
      label: sv.size_formats?.name ?? sv.sku,
      dim,
      price: Number(sv.base_price_including_vat),
      variantId: sv.id,
      sku: sv.sku,
    };
  });

  // Price tiers
  const priceTiers = (tiers ?? []).map((t) => {
    const row = t as unknown as {
      min_quantity: number;
      max_quantity: number | null;
      price_per_unit: number | string | null;
      discount_percentage: number | string | null;
    };
    return {
      min: row.min_quantity,
      max: row.max_quantity,
      unit: Number(row.price_per_unit ?? cur.base_price_including_vat),
      discount: Number(row.discount_percentage ?? 0),
    };
  });
  // Ensure at least one tier exists so the UI doesn't crash
  if (priceTiers.length === 0) {
    priceTiers.push({
      min: 1,
      max: null,
      unit: Number(cur.base_price_including_vat),
      discount: 0,
    });
  }

  const stockKey = mapStockStatus(cur.stock_status);
  const product: PDPProduct = {
    sku: cur.sku,
    name: cur.product_templates.name,
    tagline: cur.product_templates.short_description ?? "",
    cat: cur.product_templates.categories?.name ?? "",
    material: cur.product_templates.material?.name ?? "",
    from: Number(cur.base_price_including_vat),
    rating: 0,
    reviews: 0,
    stock: {
      qty: cur.stock_quantity ?? 0,
      label: STOCK_LABEL[stockKey],
      leadTime: "Envio em 48h",
    },
    images: imgList,
    variants: {
      color: [], // DB has no color dimension; UI renders empty state
      size: sizeVariants,
    },
    priceTiers,
  };

  // 6. Related products — same category, excluding current variant (best-effort filter)
  const related = categoryId
    ? (await listProducts({ categoryIds: [categoryId], limit: 5 }))
        .filter((r) => r.sku !== cur.sku)
        .slice(0, 4)
    : [];

  return { product, related };
}
