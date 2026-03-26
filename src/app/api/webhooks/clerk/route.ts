import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;

  switch (eventType) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name } = evt.data;

      console.log("New user created:", {
        userId: id,
        email: email_addresses?.[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
      });

      // In production:
      // 1. Create user profile in database
      // const { error } = await supabaseAdmin
      //   .from("profiles")
      //   .insert({
      //     user_id: id,
      //     email: email_addresses?.[0]?.email_address,
      //     first_name: first_name || "",
      //     last_name: last_name || "",
      //     role: "candidate",
      //   });

      // 2. Send welcome email
      // await sendEmail({
      //   to: email_addresses?.[0]?.email_address,
      //   ...emailTemplates.welcomeEmail({
      //     firstName: first_name || "there",
      //   }),
      // });

      break;
    }

    case "user.updated": {
      const { id, email_addresses: _email_addresses, first_name: _first_name, last_name: _last_name } = evt.data;

      console.log("User updated:", id);

      // Update user profile in database
      // await supabaseAdmin
      //   .from("profiles")
      //   .update({
      //     email: email_addresses?.[0]?.email_address,
      //     first_name: first_name || "",
      //     last_name: last_name || "",
      //   })
      //   .eq("user_id", id);

      break;
    }

    case "user.deleted": {
      const { id } = evt.data;

      console.log("User deleted:", id);

      // In production, you might want to:
      // - Soft delete or archive user data
      // - Remove from mailing lists
      // - Clean up related records

      break;
    }

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
