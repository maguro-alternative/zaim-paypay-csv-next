import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest): NextResponse {
  // GET /api/users リクエストの処理
  return NextResponse.json({ message: "Hello, world!" });
}

