import { createServiceClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { verifyOrderToken } from "@/lib/orders/token";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

// Authorization: Clerk owner (full status) OR guest capability token issued at
// order creation (?t=..., minimal status). Anonymous callers without a valid
// token get 404 — previously any caller could poll any order number.
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { orderNumber } = await params;
    const supabase = createServiceClient();
    const { userId } = await auth();
    const guestToken = new URL(request.url).searchParams.get("t");
    const hasGuestCapability = verifyOrderToken(guestToken, orderNumber);

    if (!userId && !hasGuestCapability) {
      return NextResponse.json(
        { success: false, error: "Encomenda não encontrada" },
        { status: 404 }
      );
    }

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
    const isOwner = !!userId && !!customer?.auth_user_id && customer.auth_user_id === userId;

    if (isOwner) {
      return NextResponse.json({
        success: true,
        data: {
          paymentStatus: order.payment_status,
          orderStatus: order.status,
          paidAt: order.paid_at,
        },
      });
    }

    if (hasGuestCapability) {
      return NextResponse.json({
        success: true,
        data: {
          paymentStatus: order.payment_status,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
