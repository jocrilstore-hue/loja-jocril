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
  // Bare /pesquisa shows an empty search state, not preloaded demo results.
  const query = sp.q?.trim() ?? '';
  const results = query ? await listProducts({ search: query, limit: 60 }) : [];

  return <PesquisaClient initialQuery={query} initialResults={results} />;
}
