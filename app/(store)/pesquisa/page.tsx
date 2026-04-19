import { listProducts } from '@/lib/queries/products';
import PesquisaClient from './pesquisa-client';

type SearchParams = {
  q?: string;
};

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() || 'expositor acrilico a3';
  const results = await listProducts({ search: query, limit: 60 });

  return <PesquisaClient initialQuery={query} initialResults={results} />;
}
