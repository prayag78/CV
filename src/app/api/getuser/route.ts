"use server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  return new Response(JSON.stringify(user), { status: 200 });
}
