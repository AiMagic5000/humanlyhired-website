import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const CF_ACCOUNT_ID = "82f3c6e0ba2e585cd0fe3492151de1a0";
const CF_AUTH_EMAIL = "Coreypearsonemail@gmail.com";
const CF_AUTH_KEY = "922460400012ed8596f9188ad3a21aac2918e";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Auth required" },
        { status: 401 }
      );
    }

    const { profile, jobTitle, template } = await request.json();

    if (!profile || !template) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Infer location from phone area code
    const areaCode =
      profile.phone?.replace(/\D/g, "").slice(0, 3) || "";

    // Build context about the person
    const monthlyWantNum = parseInt(
      profile.monthlyWant?.replace(/\D/g, "") || "0"
    );
    const isAmbitious = monthlyWantNum > 8000;
    const workStyle = profile.workPreference || "flexible";
    const availability = profile.hoursPerWeek || "full-time";
    const startTimeline = profile.startDate || "immediately";

    let promptTemplate = "";

    if (template === "professional-intro") {
      promptTemplate = `Write a brief, honest professional introduction (3-4 sentences) for a job applicant.
Their name is ${profile.firstName} ${profile.lastName}. They are from the ${areaCode} area code region.
They are looking for ${workStyle} work, can start ${startTimeline}, and are available ${availability} hours per week.
They need to make at least $${profile.monthlyNeed}/month and want to earn $${profile.monthlyWant}/month.
${isAmbitious ? "They are clearly ambitious and driven." : "They value stability and work-life balance."}
They are applying for: ${jobTitle || "a position"}.
Write in first person. Sound genuine, warm, and confident -- not corporate or stiff. Vary sentence length. No buzzwords. No "I am a highly motivated professional" cliches. Make it sound like a real person wrote it.`;
    } else if (template === "career-story") {
      promptTemplate = `Write a short career backstory (4-5 sentences) for a job applicant to include with their application.
Their name is ${profile.firstName} ${profile.lastName}, from the ${areaCode} area code region.
They prefer ${workStyle} work and can commit ${availability} hours per week.
Their salary goals: need $${profile.monthlyNeed}/month, want $${profile.monthlyWant}/month.
They can start ${startTimeline}. Applying for: ${jobTitle || "a new opportunity"}.
Write in first person. Tell a brief, believable story about their career journey and what drives them.
Include a mention of their location/community. Sound honest and human -- no corporate speak, no "passionate" or "driven" cliches.
${isAmbitious ? "They are pushing for growth and bigger challenges." : "They are looking for the right fit where they can contribute steadily."}`;
    } else {
      promptTemplate = `Write a short, personalized note (3-4 sentences) from a job applicant explaining why they are a good fit.
Name: ${profile.firstName} ${profile.lastName}. Area code: ${areaCode}.
Work preference: ${workStyle}. Hours: ${availability}/week. Can start: ${startTimeline}.
Salary: needs $${profile.monthlyNeed}/mo, wants $${profile.monthlyWant}/mo.
Position: ${jobTitle || "this role"}.
First person. Honest, direct, human tone. No AI cliches. Vary sentence length.`;
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: "POST",
        headers: {
          "X-Auth-Email": CF_AUTH_EMAIL,
          "X-Auth-Key": CF_AUTH_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You write brief, genuine personal statements for job applications. Never use words like: delve, tapestry, vibrant, pivotal, landscape, foster, underscore, crucial, enhance, showcase, testament, leverage, passionate, driven, motivated, dynamic, synergy, innovative, cutting-edge, empower. Write like a real person -- direct, honest, with varied sentence length.",
            },
            { role: "user", content: promptTemplate },
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CF AI error:", response.status, errorText);
      return NextResponse.json(
        { success: false, error: "AI generation failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.result?.response || "";

    return NextResponse.json({ success: true, text: generatedText });
  } catch (error) {
    console.error("AI intro error:", error);
    return NextResponse.json(
      { success: false, error: "Generation failed" },
      { status: 500 }
    );
  }
}
