import ResumeBuilderPage from "@/components/resumebuilder";

type Props = {
  params: Promise<{ id: string }>;
};


export default async function Template({ params }: Props) {
  const { id } = await params;


  return <ResumeBuilderPage templateId={id} />;
}
