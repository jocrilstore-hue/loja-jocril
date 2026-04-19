import { notFound } from "next/navigation";
import PDPClient from "./pdp-client";
import { getPDPBySlug } from "@/lib/queries/pdp";

export const revalidate = 300;

export default async function PDPPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPDPBySlug(slug);
  if (!data) notFound();
  return <PDPClient product={data.product} related={data.related} />;
}
