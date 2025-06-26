import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { template, userData } = await req.json();
    //console.log("template", template);
    console.log("userData", userData);

    const systemPrompt = `
      You are a highly skilled LaTeX resume editor. You will receive a LaTeX resume template and user-provided data. Your task is to seamlessly integrate the user's data into the existing LaTeX template while strictly adhering to the template's original formatting, style, spacing, and structure.  Crucially, you should ONLY update or add sections for which corresponding data is explicitly provided in the User Data.

      Instructions:

      1.  **Data-Driven Section Handling:**  For each section (e.g., Education, Experience, Projects, Skills) in the *LaTeX template*, check if corresponding data exists in the *User Data*.
          *   **If data exists:** Update the section in the LaTeX code with the user's data. The number of items within a section may vary; add or remove \\item entries accordingly while maintaining consistent formatting.
          *   **If data does NOT exist:**  Remove the section in the LaTeX template COMPLETELY. Do not add any empty section headings. Add the section in the latex code only if the user provides data for that section.

      2.  **New Section Addition (Conditional):** If the user provides data for a section that is **NOT** already present in the LaTeX template, AND only if it's explicitly requested, intelligently add that section *once* in a logical location within the resume, using the template's established formatting style. Avoid any duplication of sections. Ensure the placement is semantically appropriate.

      3.  **Content Insertion:**

          *   Insert the user's provided content into the appropriate sections.
          *   Maintain the template's consistent use of LaTeX commands like \\resumeSubItem, \\resumeItem, \\item, and any custom macros.
          *   Respect LaTeX indentation and alignment.
          *   Ensure hyperlinks (e.g., GitHub, LinkedIn) use \\href.
          *   Add date in month-year format.

      4.  **Error Handling & LaTeX Validity:** Pay very close attention to LaTeX syntax.  Ensure that all commands are properly closed, environments are correctly nested, and there are no missing braces or other LaTeX errors that would prevent the code from compiling. Prioritize generating valid LaTeX code above all else.

      5. **Output**: Return ONLY the complete, updated, and VALID LaTeX code ready for PDF compilation. No extra comments, explanations, or markdown formatting. Ensure that the returned code compiles without errors.
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
                { text: `User Data:\n${JSON.stringify(userData, null, 2)}` },
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
      console.error("❌ Invalid LaTeX returned:", updatedLatex);
      return NextResponse.json(
        {
          error: "Gemini returned invalid LaTeX code",
          debugLatex: updatedLatex || null,
        },
        { status: 500 }
      );
    }

    console.log("✅ Valid LaTeX received. Sending to render server...");
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
      console.error("❌ Render server error:", errorText);
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
    console.error("❌ Error generating resume:", err);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
