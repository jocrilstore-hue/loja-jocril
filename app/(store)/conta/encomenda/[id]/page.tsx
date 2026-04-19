import { redirect } from 'next/navigation';

export default async function ContaOrderRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/encomenda/${encodeURIComponent(id)}`);
}
