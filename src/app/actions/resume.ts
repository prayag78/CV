"use server";

import prisma from "../../../lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function createResume(resume: Prisma.ResumeUncheckedCreateInput) {
  try {
    const newResume = await prisma.resume.create({
      data: resume,
    });

    console.log("Resume created successfully:", newResume.id);
    return newResume;
  } catch (error) {
    console.error("Error creating resume:", error);
    return null;
  }
}
