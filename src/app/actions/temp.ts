"use server";

import prisma from "../../../lib/prisma";

export async function getTemplates() {
  try {
    const templates = await prisma.template.findMany();
    //console.log("templates", templates);
    return templates;
  } catch (error) {
    console.error("Error fetching templates", error);
    return [];
  }
}

export async function getTemplate(name: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { name },
    });
    return template;
  } catch (error) {
    console.error("Error fetching template", error);
    return null;
  }
}
