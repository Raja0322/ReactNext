import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseWorkspace } from "@/features/case-workspace/case-workspace";
import { getEntityById } from "@/services/entity-service";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
     console.log("generateMetadata=============="+params);
  const { id } = await params;
   console.log("id  generateMetadata =============="+id );
  const entity = await getEntityById(id);
  console.log("entity  generateMetadata =", JSON.stringify(entity));

  return { title: entity?.name ?? "Entity not found" };
}

export default async function EntityPage({ params }: PageProps) {
 console.log("params=============="+params);
  const { id } = await params;
   console.log("id =============="+id );
  const entity = await getEntityById(id);
  console.log("entity =", JSON.stringify(entity));
  if (!entity) notFound();
  return <CaseWorkspace key={entity.id} entity={entity} />;
}
