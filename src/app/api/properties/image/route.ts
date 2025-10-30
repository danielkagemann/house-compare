import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  const res = await fetch(url);
  const blob = await res.blob();

  return new Response(blob, {
    headers: {
      "Content-Type": blob.type,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
