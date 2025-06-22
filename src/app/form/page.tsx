// app/form/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateTemplatePage from "@/components/newtemp";

export default async function FormPage() {
  const user = await currentUser();
  const allowedEmail = process.env.ADMIN_EMAIL;

  if (!user || user.emailAddresses[0].emailAddress !== allowedEmail) {
    
    redirect("/unauthorized");
  }

  return (
    <div>
      <CreateTemplatePage />
    </div>
  );
}

