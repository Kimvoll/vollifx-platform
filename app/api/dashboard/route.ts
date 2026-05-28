import { NextResponse } from "next/server";
import { activity, dashboardStats, growthData, weeklyData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ dashboardStats, growthData, weeklyData, activity });
}
