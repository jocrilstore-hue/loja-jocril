import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"),
  size_format: z.string().min(1, "Formato é obrigatório"),
  base_price_including_vat: z.number().positive("Preço deve ser positivo"),
  stock_quantity: z.number().int().min(0).default(0),
  is_active: z.boolean().optional().default(true),
});

// POST — create variant for a product template
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) {
    return NextResponse.json(
      { success: false, error: "ID inválido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parse = createVariantSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: parse.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify the product template exists
    const { data: template } = await supabase
      .from("product_templates")
      .select("id")
      .eq("id", productId)
      .single();

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("product_variants")
      .insert({
        product_template_id: productId,
        sku: parse.data.sku,
        size_format: parse.data.size_format,
        base_price_including_vat: parse.data.base_price_including_vat,
        stock_quantity: parse.data.stock_quantity,
        is_active: parse.data.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/products/[id]/variants] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products/[id]/variants] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
