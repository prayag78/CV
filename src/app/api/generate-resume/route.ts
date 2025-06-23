// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { template, userData } = await req.json();

//     const systemPrompt = `
// You are a highly skilled LaTeX resume editor. You will receive a LaTeX resume template and user-provided data. Your task is to seamlessly integrate the user's data into the existing LaTeX template while strictly adhering to the template's original formatting, style, spacing, and structure.

// Instructions:

// Preserve Original Formatting: Do not alter any existing LaTeX commands, styling, spacing, or alignment. The goal is to update content, not redesign the resume.

// Section Handling:

// Existing Sections: If a section (e.g., Education, Experience, Projects, Skills) exists in the LaTeX template and corresponding data for that section is provided in the User Data, update the section's content with the user's data. The number of items within a section may vary; add or remove \\item entries accordingly while maintaining consistent formatting.

// New Sections: If the user provides data for a section not present in the LaTeX template, intelligently add that section only once in a logical location within the resume, using the template's established formatting style. Avoid any duplication of sections. Ensure the placement is semantically appropriate.

// Missing Sections: If a section is in the LaTeX template but no corresponding data is provided in the User Data, leave that section completely unchanged. Do not create an empty section heading.

// Content Insertion:

// Insert the user's provided content into the appropriate sections.

// Maintain the template's consistent use of LaTeX commands like \\resumeSubItem, \\resumeItem, \\item, and any custom macros.

// Respect LaTeX indentation and alignment. Any additions or modifications must match the existing style.

// Hyperlinks: Ensure that hyperlinks in the user data (e.g., for project links, LinkedIn profiles, GitHub repositories) are correctly implemented using the \\href command within the LaTeX code.

// Output: Return only the complete, modified LaTeX code, ready for direct compilation to a PDF. Do not include any explanations, commentary, or markdown formatting in the output.

// Input Format:

// You will receive two inputs:

// LaTeX Template: A complete LaTeX code string representing the resume template.

// User Data: A JSON string containing the user's resume information.

// Special Considerations:

// Pay close attention to detail to avoid breaking any LaTeX environments (\\begin{itemize}, \\section, etc.).

// Ensure the output is valid LaTeX code that can be compiled without errors.

// Two Primary Modes (Determine by the mode key in User Data):

// mode: "update": Standard data update as described above.

// mode: "optimize": (This is a deferred feature, for now, treat as "update". Later, this mode will involve AI-powered content optimization for ATS based on additional instructions which will be provided then.) For now, apply same rules as in "update" mode.

// Begin!

// Given the following LaTeX resume template:

// ${template}

// Update the LaTeX with the following data:

// ${JSON.stringify(userData, null, 2)}

// Return ONLY the updated LaTeX code.
// `;

//     const geminiRes = await fetch(
//       'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 { text: systemPrompt }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const geminiData = await geminiRes.json();
//     const updatedLatex = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("updatedLatex", updatedLatex.slice(0, 100));

//     if (!updatedLatex) throw new Error("No response from Gemini");

//     console.log("process.env.RENDER_LATEX_SERVER_URL", process.env.RENDER_LATEX_SERVER_URL);

//     const renderRes = await fetch(`${process.env.RENDER_LATEX_SERVER_URL}/compile`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ latex: updatedLatex }),
//     });

//     console.log("renderRes", renderRes);

//     if (!renderRes.ok) throw new Error("Render server failed");

//     const pdfBuffer = await renderRes.arrayBuffer();

//     return new NextResponse(pdfBuffer, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'inline; filename="resume.pdf"',
//       },
//     });
//   } catch (err) {
//     console.error("Error generating resume:", err);
//     return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { template, userData } = await req.json();
//     console.log("template", template);
//     console.log("userData", userData);

//     const systemPrompt = `
// You are a highly skilled LaTeX resume editor. You will receive a LaTeX resume template and user-provided data. Your task is to seamlessly integrate the user's data into the existing LaTeX template while strictly adhering to the template's original formatting, style, spacing, and structure.

// Instructions:

// Preserve Original Formatting: Do not alter any existing LaTeX commands, styling, spacing, or alignment. The goal is to update content, not redesign the resume.

// Section Handling:

// - Existing Sections: If a section (e.g., Education, Experience, Projects, Skills) exists in the LaTeX template and corresponding data for that section is provided in the User Data, update the section's content with the user's data. The number of items within a section may vary; add or remove \\item entries accordingly while maintaining consistent formatting.
// - New Sections: If the user provides data for a section not present in the LaTeX template, intelligently add that section only once in a logical location within the resume, using the template's established formatting style. Avoid any duplication of sections. Ensure the placement is semantically appropriate.
// - Missing Sections: If a section is in the LaTeX template but no corresponding data is provided in the User Data, leave that section completely unchanged. Do not create an empty section heading.

// Content Insertion:

// - Insert the user's provided content into the appropriate sections.
// - Maintain the template's consistent use of LaTeX commands like \\resumeSubItem, \\resumeItem, \\item, and any custom macros.
// - Respect LaTeX indentation and alignment.
// - Ensure hyperlinks (e.g., GitHub, LinkedIn) use \\href.

// Output: Return ONLY the complete, updated LaTeX code ready for PDF compilation. No extra comments, explanations, or markdown formatting.
// `;

//     const geminiRes = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 { text: systemPrompt },
//                 { text: `LaTeX Template:\n${template}` },
//                 { text: `User Data:\n${JSON.stringify(userData, null, 2)}` },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     const geminiData = await geminiRes.json();
//     const updatedLatex = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//     // 🔍 Validate response
//     if (!updatedLatex || !updatedLatex.includes('\\documentclass')) {
//       console.error("❌ Invalid LaTeX returned:", updatedLatex?.slice(0, 300));
//       return NextResponse.json(
//         { error: 'Gemini returned invalid LaTeX code', debugLatex: updatedLatex || null },
//         { status: 500 }
//       );
//     }

//     console.log("✅ Valid LaTeX received. Sending to render server...");
//     console.log("latexcode", updatedLatex);

//     const renderRes = await fetch(`${process.env.RENDER_LATEX_SERVER_URL}/compile`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ latex: updatedLatex }),
//     });

//     if (!renderRes.ok) {
//       console.error("❌ Render server error:", await renderRes.text());
//       throw new Error("Render server failed");
//     }

//     const pdfBuffer = await renderRes.arrayBuffer();

//     return new NextResponse(pdfBuffer, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'inline; filename="resume.pdf"',
//       },
//     });

//   } catch (err) {
//     console.error("❌ Error generating resume:", err);
//     return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { template, userData } = await req.json();
    console.log("template", template);
    console.log("userData", userData);

//     const systemPrompt = `
// You are a highly skilled LaTeX resume editor. You will receive a LaTeX resume template and user-provided data. Your task is to seamlessly integrate the user's data into the existing LaTeX template while strictly adhering to the template's original formatting, style, spacing, and structure.

// Instructions:

// Preserve Original Formatting: Do not alter any existing LaTeX commands, styling, spacing, or alignment. The goal is to update content, not redesign the resume.

// Section Handling:

// - Existing Sections: If a section (e.g., Education, Experience, Projects, Skills) exists in the LaTeX template and corresponding data for that section is provided in the User Data, update the section's content with the user's data. The number of items within a section may vary; add or remove \\item entries accordingly while maintaining consistent formatting.
// - New Sections: If the user provides data for a section not present in the LaTeX template, intelligently add that section only once in a logical location within the resume, using the template's established formatting style. Avoid any duplication of sections. Ensure the placement is semantically appropriate.
// - Missing Sections: If a section is in the LaTeX template but no corresponding data is provided in the User Data, leave that section completely unchanged. Do not create an empty section heading.

// Content Insertion:

// - Insert the user's provided content into the appropriate sections.
// - Maintain the template's consistent use of LaTeX commands like \\resumeSubItem, \\resumeItem, \\item, and any custom macros.
// - Respect LaTeX indentation and alignment.
// - Ensure hyperlinks (e.g., GitHub, LinkedIn) use \\href.

// Output: Return ONLY the complete, updated LaTeX code ready for PDF compilation. No extra comments, explanations, or markdown formatting.
// `;

      const systemPrompt = `
      You are a highly skilled LaTeX resume editor. You will receive a LaTeX resume template and user-provided data. Your task is to seamlessly integrate the user's data into the existing LaTeX template while strictly adhering to the template's original formatting, style, spacing, and structure.  Crucially, you should ONLY update or add sections for which corresponding data is explicitly provided in the User Data.

      Instructions:

      1.  **Data-Driven Section Handling:**  For each section (e.g., Education, Experience, Projects, Skills) in the *LaTeX template*, check if corresponding data exists in the *User Data*.
          *   **If data exists:** Update the section in the LaTeX code with the user's data. The number of items within a section may vary; add or remove \\item entries accordingly while maintaining consistent formatting.
          *   **If data does NOT exist:**  Leave the section in the LaTeX template COMPLETELY UNCHANGED. Do NOT modify, delete, or add anything to that section. Preserve it exactly as it is in the original template.  Do NOT create empty section headings.

      2.  **New Section Addition (Conditional):** If the user provides data for a section that is **NOT** already present in the LaTeX template, AND only if it's explicitly requested, intelligently add that section *once* in a logical location within the resume, using the template's established formatting style. Avoid any duplication of sections. Ensure the placement is semantically appropriate.

      3.  **Content Insertion:**

          *   Insert the user's provided content into the appropriate sections.
          *   Maintain the template's consistent use of LaTeX commands like \\resumeSubItem, \\resumeItem, \\item, and any custom macros.
          *   Respect LaTeX indentation and alignment.
          *   Ensure hyperlinks (e.g., GitHub, LinkedIn) use \\href.

      4.  **Error Handling & LaTeX Validity:** Pay very close attention to LaTeX syntax.  Ensure that all commands are properly closed, environments are correctly nested, and there are no missing braces or other LaTeX errors that would prevent the code from compiling. Prioritize generating valid LaTeX code above all else.

      5. **Personal Details Insertion**: Insert the user's Name, Contact details at the heading of the latex code using \begin{center} tag.

      6. **Output**: Return ONLY the complete, updated, and VALID LaTeX code ready for PDF compilation. No extra comments, explanations, or markdown formatting. Ensure that the returned code compiles without errors.
      `;

    // 🔸 Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    let updatedLatex = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // 🔸 Strip Markdown-style code blocks if present
    if (updatedLatex?.startsWith("```latex")) {
      updatedLatex = updatedLatex.replace(/^```latex\s*/i, '');
    }
    if (updatedLatex?.endsWith("```")) {
      updatedLatex = updatedLatex.replace(/```$/, '').trim();
    }

    // 🔸 Validate LaTeX structure
    if (!updatedLatex || !updatedLatex.includes('\\documentclass') || !updatedLatex.includes('\\begin{document}')) {
      console.error("❌ Invalid LaTeX returned:", updatedLatex);
      return NextResponse.json(
        { error: 'Gemini returned invalid LaTeX code', debugLatex: updatedLatex || null },
        { status: 500 }
      );
    }

    console.log("✅ Valid LaTeX received. Sending to render server...");
    console.log("latexcode", updatedLatex);

    // 🔸 Call Render PDF compiler
    const renderRes = await fetch(`${process.env.RENDER_LATEX_SERVER_URL}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: updatedLatex }),
    });

    if (!renderRes.ok) {
      const errorText = await renderRes.text();
      console.error("❌ Render server error:", errorText);
      return NextResponse.json(
        { error: 'Render server failed', renderError: errorText, latex: updatedLatex },
        { status: 500 }
      );
    }

    const pdfBuffer = await renderRes.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });

  } catch (err) {
    console.error("❌ Error generating resume:", err);
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
  }
}

