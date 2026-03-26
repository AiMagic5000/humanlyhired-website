import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  services: {
    database: "connected" | "disconnected" | "not_configured";
    auth: "configured" | "not_configured";
  };
  uptime: number;
}

const startTime = Date.now();

export async function GET() {
  const health: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    services: {
      database: "not_configured",
      auth: "not_configured",
    },
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  // Check Clerk configuration
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    health.services.auth = "configured";
  }

  // Check database connection
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabaseAdmin.from("profiles").select("id").limit(1);
      health.services.database = error ? "disconnected" : "connected";
      if (error) {
        health.status = "degraded";
      }
    } catch {
      health.services.database = "disconnected";
      health.status = "degraded";
    }
  }

  // Determine overall health
  if (health.services.auth === "not_configured") {
    health.status = "unhealthy";
  }

  const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
