import { Resend } from "resend";
import nodemailer from "nodemailer";

// Resend client (primary)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// SMTP Configuration (fallback)
const smtpConfig = {
  host: process.env.SMTP_HOST || "mail.mxrouting.net",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

// Create nodemailer transporter
const smtpTransporter = nodemailer.createTransport(smtpConfig);

// Check which email service is configured
function getEmailProvider(): "resend" | "smtp" | null {
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("placeholder")) {
    return "resend";
  }
  if (
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    !process.env.SMTP_PASSWORD.includes("your-email-password")
  ) {
    return "smtp";
  }
  return null;
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail({ to, subject, html, from, attachments }: EmailData) {
  const provider = getEmailProvider();
  const fromAddress = from || `Humanly Hired <${process.env.EMAIL_FROM || "contact@humanlyhired.com"}>`;

  if (!provider) {
    console.log("Email not configured. Would have sent:", { to, subject, attachments: attachments?.map(a => a.filename) });
    return { id: "mock-email-" + Date.now() };
  }

  try {
    if (provider === "resend" && resend) {
      const emailPayload: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        attachments?: { filename: string; content: Buffer }[];
      } = {
        from: fromAddress,
        to: [to],
        subject,
        html,
      };

      if (attachments && attachments.length > 0) {
        emailPayload.attachments = attachments.map(att => ({
          filename: att.filename,
          content: Buffer.from(att.content),
        }));
      }

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error("Resend email error:", error);
        throw new Error(error.message);
      }

      console.log("Email sent via Resend:", data?.id);
      return data;
    }

    if (provider === "smtp") {
      const mailOptions: {
        from: string;
        to: string;
        subject: string;
        html: string;
        text: string;
        attachments?: { filename: string; content: string; contentType: string }[];
      } = {
        from: fromAddress,
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ""),
      };

      if (attachments && attachments.length > 0) {
        mailOptions.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        }));
      }

      const info = await smtpTransporter.sendMail(mailOptions);

      console.log("Email sent via SMTP:", info.messageId);
      return { id: info.messageId };
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

// Helper function to send form submission with JSON attachment
export async function sendFormSubmissionEmail(
  formType: string,
  formData: Record<string, unknown>,
  subject: string,
  htmlContent: string
) {
  const jsonContent = JSON.stringify(formData, null, 2);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${formType}-submission-${timestamp}.json`;

  return sendEmail({
    to: "contact@humanlyhired.com",
    subject,
    html: htmlContent,
    attachments: [
      {
        filename,
        content: jsonContent,
        contentType: "application/json",
      },
    ],
  });
}

// Email Templates
export const emailTemplates = {
  applicationConfirmation: (data: {
    firstName: string;
    jobTitle: string;
    company: string;
  }) => ({
    subject: `Application Received - ${data.jobTitle} at ${data.company}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Received</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1E40AF; margin: 0; font-size: 24px;">Humanly<span style="color: #0D9488;">Hired</span></h1>
          </div>

          <div style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); border-radius: 12px; padding: 30px; color: white; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px;">Application Received!</h2>
            <p style="margin: 0; opacity: 0.9;">Thank you for applying, ${data.firstName}</p>
          </div>

          <p>Hi ${data.firstName},</p>

          <p>Thank you for your interest in the <strong>${data.jobTitle}</strong> position at <strong>${data.company}</strong>. We've successfully received your application.</p>

          <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937;">What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4B5563;">
              <li style="margin-bottom: 10px;">Our recruitment team will review your application</li>
              <li style="margin-bottom: 10px;">If your qualifications match, we'll contact you within 3-5 business days</li>
              <li style="margin-bottom: 10px;">You can track your application status in your dashboard</li>
            </ul>
          </div>

          <p>In the meantime, feel free to browse other opportunities on our <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://humanlyhired.com"}/jobs" style="color: #3B82F6;">job board</a>.</p>

          <p>Best regards,<br>
          <strong>The Humanly Hired Team</strong></p>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

          <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
            Brand Metrics LLC<br>
            1501 South Greeley Highway, Suite C, Cheyenne, WY 82007<br>
            <a href="tel:8888048424" style="color: #9CA3AF;">(888) 762-6691</a> |
            <a href="mailto:contact@humanlyhired.com" style="color: #9CA3AF;">contact@humanlyhired.com</a>
          </p>
        </body>
      </html>
    `,
  }),

  welcomeEmail: (data: { firstName: string }) => ({
    subject: "Welcome to Humanly Hired!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Humanly Hired</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1E40AF; margin: 0; font-size: 24px;">Humanly<span style="color: #0D9488;">Hired</span></h1>
          </div>

          <div style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); border-radius: 12px; padding: 30px; color: white; margin-bottom: 30px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px;">Welcome, ${data.firstName}!</h2>
            <p style="margin: 0; opacity: 0.9;">Your journey to your next career opportunity starts here</p>
          </div>

          <p>Hi ${data.firstName},</p>

          <p>Thank you for joining Humanly Hired! We're excited to help you find your next great opportunity.</p>

          <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1F2937;">Here's what you can do:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4B5563;">
              <li style="margin-bottom: 10px;"><strong>Complete your profile</strong> - Add your skills and experience</li>
              <li style="margin-bottom: 10px;"><strong>Browse jobs</strong> - Explore 50+ open positions</li>
              <li style="margin-bottom: 10px;"><strong>Apply easily</strong> - One-click apply to matching jobs</li>
              <li style="margin-bottom: 10px;"><strong>Track applications</strong> - Monitor your progress in real-time</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://humanlyhired.com"}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Go to My Dashboard</a>
          </div>

          <p>If you have any questions, our team is here to help!</p>

          <p>Best regards,<br>
          <strong>The Humanly Hired Team</strong></p>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

          <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
            Brand Metrics LLC<br>
            1501 South Greeley Highway, Suite C, Cheyenne, WY 82007<br>
            <a href="tel:8888048424" style="color: #9CA3AF;">(888) 762-6691</a> |
            <a href="mailto:contact@humanlyhired.com" style="color: #9CA3AF;">contact@humanlyhired.com</a>
          </p>
        </body>
      </html>
    `,
  }),

  newApplicationAdmin: (data: {
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    applicationId: string;
  }) => ({
    subject: `New Application: ${data.jobTitle} - ${data.candidateName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Application Received</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1E40AF; margin: 0; font-size: 24px;">Humanly<span style="color: #0D9488;">Hired</span></h1>
          </div>

          <div style="background: #10B981; border-radius: 12px; padding: 20px; color: white; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 18px;">New Application Received</h2>
          </div>

          <p>A new application has been submitted:</p>

          <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Position:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.jobTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Candidate:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.candidateName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.candidateEmail}" style="color: #3B82F6;">${data.candidateEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Application ID:</td>
                <td style="padding: 8px 0;">${data.applicationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Submitted:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://humanlyhired.com"}/admin/applications" style="display: inline-block; background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View Application</a>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

          <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
            This is an automated notification from Humanly Hired
          </p>
        </body>
      </html>
    `,
  }),

  newApplicationNotification: (data: {
    jobTitle: string;
    candidateName: string;
    candidateEmail: string;
    appliedAt: string;
  }) => ({
    subject: `New Application: ${data.jobTitle} - ${data.candidateName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Application Received</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1E40AF; margin: 0; font-size: 24px;">Humanly<span style="color: #0D9488;">Hired</span></h1>
          </div>

          <div style="background: #10B981; border-radius: 12px; padding: 20px; color: white; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 18px;">New Application Received</h2>
          </div>

          <p>A new application has been submitted:</p>

          <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Position:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.jobTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Candidate:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.candidateName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.candidateEmail}" style="color: #3B82F6;">${data.candidateEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Applied:</td>
                <td style="padding: 8px 0;">${data.appliedAt}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://humanlyhired.com"}/admin/applications" style="display: inline-block; background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View Application</a>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

          <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
            This is an automated notification from Humanly Hired
          </p>
        </body>
      </html>
    `,
  }),

  contactFormNotification: (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => ({
    subject: `Contact Form: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1E40AF; margin: 0; font-size: 24px;">Humanly<span style="color: #0D9488;">Hired</span></h1>
          </div>

          <div style="background: #3B82F6; border-radius: 12px; padding: 20px; color: white; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 18px;">New Contact Form Submission</h2>
          </div>

          <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280; width: 100px;">Name:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #3B82F6;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Phone:</td>
                <td style="padding: 8px 0;">${data.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Subject:</td>
                <td style="padding: 8px 0;">${data.subject}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1F2937; font-size: 14px;">Message:</h3>
            <p style="margin: 0; color: #4B5563; white-space: pre-wrap;">${data.message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

          <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
            This message was sent from the Humanly Hired website contact form
          </p>
        </body>
      </html>
    `,
  }),
};
