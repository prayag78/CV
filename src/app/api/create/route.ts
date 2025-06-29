"use server";

import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, templateId, title, latexCode, pdfUrl, isCustom } = await req.json();
  try {
    const newResume = await prisma.resume.create({
      data: {
        userId,
        templateId,
        title,
        latexCode,
        pdfUrl,
        isCustom,
      },
    });
    return NextResponse.json(newResume);
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}
