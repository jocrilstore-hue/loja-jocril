import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().optional(),
  category_id: z.number().optional().nullable(),
  is_featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// POST — create product template
export async function POST(request: Request) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parse = createProductSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: parse.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, slug, category_id, is_featured, is_active } = parse.data;
    const finalSlug = slug || generateSlug(name);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("product_templates")
      .insert({
        name,
        slug: finalSlug,
        category_id: category_id ?? null,
        is_featured: is_featured ?? false,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/products] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET — list all product templates with variant count
export async function GET() {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("product_templates")
      .select(
        `
        *,
        variant_count:product_variants(count),
        categories ( id, name, slug ),
        variants:product_variants ( stock_quantity, base_price_including_vat )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/products] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[GET /api/admin/products] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
