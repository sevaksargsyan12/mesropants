import { NextRequest, NextResponse } from "next/server";
import { getCandleLocalizedSlugs } from "@/lib/graphql/queries/candles";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const slugs = await getCandleLocalizedSlugs(decodeURIComponent(slug));
  return NextResponse.json(slugs);
}
