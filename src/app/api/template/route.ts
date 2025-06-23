import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, defaultLatex, isPublic, thumbnailUrl, sections } = await req.json();

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
  } catch (error: any) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
