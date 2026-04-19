import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { orderNumber } = await params;
    const supabase = await createClient();
    const { userId } = await auth();

    if (userId) {
      const { data: order, error } = await supabase
        .from("orders")
        .select("payment_status, status, paid_at, customer:customers(auth_user_id)")
        .eq("order_number", orderNumber)
        .single();

      if (error || !order) {
        return NextResponse.json(
          { success: false, error: "Encomenda não encontrada" },
          { status: 404 }
        );
      }

      const customer = order.customer as { auth_user_id?: string } | null;
      if (customer?.auth_user_id && customer.auth_user_id !== userId) {
        return NextResponse.json(
          { success: false, error: "Não autorizado" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          paymentStatus: order.payment_status,
          orderStatus: order.status,
          paidAt: order.paid_at,
        },
      });
    } else {
      const { data: order, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("order_number", orderNumber)
        .single();

      if (error || !order) {
        return NextResponse.json(
          { success: false, error: "Encomenda não encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          paymentStatus: order.payment_status,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
