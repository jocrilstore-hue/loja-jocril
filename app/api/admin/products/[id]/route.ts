import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth/admin";

const patchProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  category_id: z.number().optional().nullable(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// PATCH — update product template
export async function PATCH(
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
    const parse = patchProductSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: parse.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("product_templates")
      .update({ ...parse.data, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/admin/products/[id]] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[PATCH /api/admin/products/[id]] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE — soft delete (set is_active = false)
export async function DELETE(
  _request: Request,
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
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("product_templates")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      console.error("[DELETE /api/admin/products/[id]] error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id: productId } });
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]] unexpected:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
