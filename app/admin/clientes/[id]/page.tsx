import AdminClienteDetailClient from "./cliente-detail-client";

export default async function AdminClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminClienteDetailClient id={id} />;
}
