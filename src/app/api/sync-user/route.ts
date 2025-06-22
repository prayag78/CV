import { syncUser } from "@/actions/user";
import { NextResponse } from "next/server";

export async function POST() {
  await syncUser();
  return NextResponse.json({ status: "ok" });
}
