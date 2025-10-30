import { type NextRequest } from "next/server";
import db from "@/lib/db";

/**
 * api/verify-code
 */
export async function GET(request: NextRequest) {
  // get token from query
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Kein Bestätigungscode angegeben." }),
      {
        status: 400,
      }
    );
  }

  // search in database for code
  const user = db
    .prepare("SELECT access FROM USER WHERE access = ?")
    .get(code) as { access: string } | undefined;

  // if code is not found we return 404 otherwise return user data
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Bestätigungscode nicht gefunden." }),
      {
        status: 404,
      }
    );
  }

  return new Response(JSON.stringify({ token: user.access }), {
    status: 200,
  });
}
