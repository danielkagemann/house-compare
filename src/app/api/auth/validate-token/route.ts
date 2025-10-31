import { type NextRequest } from "next/server";
import db, { getUserIdFromAccessToken } from "@/lib/db";
import { get } from "http";

/**
 * api/validate-token
 */
export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  const userId = getUserIdFromAccessToken(accessToken);

  return new Response(null, {
    status: userId ? 204 : 401,
  });
}
