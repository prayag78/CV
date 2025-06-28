import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    try {
        const template = await prisma.template.findUnique({
            where: { name },
        });
        return NextResponse.json(template);
    } catch (error) {
        console.error("Error fetching template", error);
        return NextResponse.json({ error: "Error fetching template" }, { status: 500 });
    }
}
