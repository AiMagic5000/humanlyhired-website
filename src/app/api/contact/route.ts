import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { z } from "zod";
import { sendFormSubmissionEmail, emailTemplates } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
  type: z.enum(["general", "employer", "candidate"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    console.log("Contact form submission:", validatedData);

    // Send email to admin with JSON attachment
    try {
      const emailHtml = emailTemplates.contactFormNotification({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || "Not provided",
        subject: validatedData.subject,
        message: validatedData.message,
      }).html;

      await sendFormSubmissionEmail(
        "contact-form",
        {
          ...validatedData,
          submittedAt: new Date().toISOString(),
          formType: "Contact Form",
        },
        `Contact Form: ${validatedData.subject} - ${validatedData.name}`,
        emailHtml
      );
    } catch (emailError) {
      console.error("Failed to send contact form email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
