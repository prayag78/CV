"use server";

import prisma from "../../../lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function createResume(resume: Prisma.ResumeUncheckedCreateInput) {
  try {
    const newResume = await prisma.resume.create({
      data: resume,
    });

    return newResume;
  } catch (error) {
    console.error("Error creating resume:", error);
    return null;
  }
}
