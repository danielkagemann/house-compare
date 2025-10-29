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
    console.log("verify-code::no code");
    return new Response(
      JSON.stringify({ error: "Kein Bestätigungscode angegeben." }),
      {
        status: 400,
      }
    );
  }

  // search in database for code
  const user = db.prepare("SELECT * FROM USER WHERE access = ?").get(code);

  // if code is not found we return 404 otherwise return user data
  if (!user) {
    console.log("verify-code::code not found");
    return new Response(
      JSON.stringify({ error: "Bestätigungscode nicht gefunden." }),
      {
        status: 404,
      }
    );
  }

  console.log("verify-code::code valid, returning user data");
  return new Response(JSON.stringify(user), {
    status: 200,
  });
}
