"use server";

import prisma from "../../../lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function createResume(resume: Prisma.ResumeCreateInput) {
  try {
    // Validate required fields before attempting to create
    if (!resume.user?.connect?.id) {
      console.error("Missing user ID in resume creation");
      return null;
    }

    if (!resume.template?.connect?.id) {
      console.error("Missing template ID in resume creation");
      return null;
    }

    if (!resume.latexCode) {
      console.error("Missing LaTeX code in resume creation");
      return null;
    }

    const newResume = await prisma.resume.create({
      data: resume,
    });

    console.log("Resume created successfully:", newResume.id);
    return newResume;
  } catch (error) {
    console.error("Error creating resume:", error);

    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check for specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      console.error("Prisma error code:", (error as { code: string }).code);
    }

    return null;
  }
}
