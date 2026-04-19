import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/queries/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || undefined;
    const products = await listProducts({ search: query, limit: 60 });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('[GET /api/products/search] unexpected:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao pesquisar produtos' },
      { status: 500 }
    );
  }
}
