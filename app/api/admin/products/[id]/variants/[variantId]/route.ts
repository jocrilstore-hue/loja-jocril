import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

const patchVariantSchema = z.object({
  sku: z.string().min(1).optional(),
  size_format: z.string().optional(),
  base_price_including_vat: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

// PATCH — update variant (includes stock_quantity)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  }

  const { variantId } = await params;
  const vid = Number(variantId);
  if (isNaN(vid)) {
    return NextResponse.json(
      { success: false, error: "ID de variante inválido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parse = patchVariantSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: parse.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("product_variants")
      .update(parse.data)
      .eq("id", vid)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/admin/products/[id]/variants/[variantId]] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Variante não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[PATCH /api/admin/products/[id]/variants/[variantId]] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE — soft delete variant (set is_active = false)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { isAdmin } = await getAdminContext();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  }

  const { variantId } = await params;
  const vid = Number(variantId);
  if (isNaN(vid)) {
    return NextResponse.json(
      { success: false, error: "ID de variante inválido" },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("product_variants")
      .update({ is_active: false })
      .eq("id", vid);

    if (error) {
      console.error("[DELETE /api/admin/products/[id]/variants/[variantId]] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id: vid } });
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]/variants/[variantId]] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
