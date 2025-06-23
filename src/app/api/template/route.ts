import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, defaultLatex, isPublic, thumbnailUrl, sections } =
      await req.json();

    const newTemplate = await prisma.template.create({
      data: {
        name,
        defaultLatex,
        isPublic,
        thumbnailUrl,
        sections: sections || [],
      },
    });

    return NextResponse.json({ success: true, template: newTemplate });
  } catch (error: unknown) {
    console.error("Error creating template:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
