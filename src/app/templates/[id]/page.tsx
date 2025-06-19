import ResumeBuilderPage from "@/components/resumebuilder";

export default async function Template({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <ResumeBuilderPage templateId={id} />
  );
}