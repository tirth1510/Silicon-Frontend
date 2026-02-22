import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "";

export async function POST(request: NextRequest) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { success: false, error: "API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const url = `${BACKEND_URL.replace(/\/$/, "")}/api/contact/product-enquiry`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to submit enquiry",
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit enquiry";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
