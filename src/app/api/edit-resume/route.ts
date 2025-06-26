import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { template, userPrompt } = await req.json();
    //console.log("template", template);
    console.log("userPrompt in edit resume", userPrompt);

    const systemPrompt = `
      You are a highly skilled LaTeX resume editor. You will receive a LaTeX resume template, user-provided instructions detailing specific modifications, and optionally, new data to incorporate. Your task is to modify the existing LaTeX resume according to the user's instructions, maintaining the original template's formatting, style, spacing, and structure as much as possible.

      Instructions:

      1. **Initial State:** You will be provided with the current LaTeX resume code. Treat this as the baseline.

      2. **Instruction Interpretation:** Carefully and precisely interpret the user's modification instructions. The instructions will specify exactly what to change, add, or delete. Pay close attention to:
         *   **Section Specificity:** The instructions will usually target specific sections (e.g., "Update the Experience section", "Delete the Skills section").
         *   **Field Specificity:** The instructions may target specific fields within a section (e.g., "Change the job title at Company X", "Add a bullet point to the Project description").
         *   **Value Modification:** Instructions may provide new text, dates, links, or other data to replace existing content.
         *   **Insertion:** Instructions may specify new entries, bullet points, or entire sections to be added. Be precise about where to add them, maintaining the existing structure.
         *   **Deletion:** Instructions may require you to completely remove sections, individual items, or specific pieces of text.

      3. **Modification Execution:**
         *   **Apply Changes Precisely:** Execute the user's instructions exactly as stated. Do NOT make assumptions or extrapolate beyond the explicitly provided instructions.
         *   **Maintain Template Integrity:**  Preserve the original LaTeX template's formatting, style, spacing, indentation, and the use of LaTeX commands like \\resumeSubItem, \\resumeItem, \\item, and custom macros.  Only modify elements directly addressed in the user's instructions.
         *   **Handle Hyperlinks:** Maintain the use of \\href for hyperlinks.
         *   **Date Format:** Keep the date format consistent (month-year).

      4. **Dependency Handling (Limited):** If the user's modification requires a minor adjustment in another field to maintain logical consistency (e.g., updating dates in Experience after adding a new job), you may make that secondary adjustment *only* if it's directly implied by the primary instruction and demonstrably necessary to keep the resume coherent. Avoid making unrelated changes.

      5. **Section Management:**
         *   If the user instructs you to remove an entire section, completely delete the section and its heading from the LaTeX code.
         *   If the user provides new data for a section that was previously removed, re-add the section to the LaTeX template in a logical location, maintaining the template's formatting style.

      6. **Error Handling & LaTeX Validity:** Prioritize generating valid LaTeX code above all else. Ensure that all commands are properly closed, environments are correctly nested, and there are no missing braces or other LaTeX errors that would prevent the code from compiling.

      7. **Output**: Return ONLY the complete, updated, and VALID LaTeX code ready for PDF compilation. No extra comments, explanations, or markdown formatting. Ensure that the returned code compiles without errors.
      `;

    // 🔸 Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `LaTeX Template:\n${template}` },
                { text: `User Prompt:\n${JSON.stringify(userPrompt, null, 2)}` },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    let updatedLatex =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // 🔸 Strip Markdown-style code blocks if present
    if (updatedLatex?.startsWith("```latex")) {
      updatedLatex = updatedLatex.replace(/^```latex\s*/i, "");
    }
    if (updatedLatex?.endsWith("```")) {
      updatedLatex = updatedLatex.replace(/```$/, "").trim();
    }

    // 🔸 Validate LaTeX structure
    if (
      !updatedLatex ||
      !updatedLatex.includes("\\documentclass") ||
      !updatedLatex.includes("\\begin{document}")
    ) {
      console.error("Invalid LaTeX returned:", updatedLatex);
      return NextResponse.json(
        {
          error: "Gemini returned invalid LaTeX code",
          debugLatex: updatedLatex || null,
        },
        { status: 500 }
      );
    }

    console.log("Valid LaTeX received. Sending to render server...");
    console.log("latexcode", updatedLatex);

    // 🔸 Call Render PDF compiler
    const renderRes = await fetch(
      `${process.env.RENDER_LATEX_SERVER_URL}/compile`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: updatedLatex }),
      }
    );

    if (!renderRes.ok) {
      const errorText = await renderRes.text();
      console.error("Render server error:", errorText);
      return NextResponse.json(
        {
          error: "Render server failed",
          renderError: errorText,
          latex: updatedLatex,
        },
        { status: 500 }
      );
    }

    const pdfBuffer = await renderRes.arrayBuffer();

    // 🔸 Convert PDF buffer to base64 string
    const base64PDF = Buffer.from(pdfBuffer).toString("base64");

    // 🔸 Return JSON with LaTeX and PDF
    return NextResponse.json({
      latex: updatedLatex,
      pdf: base64PDF,
    });
  } catch (err) {
    console.error("Error generating resume:", err);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
