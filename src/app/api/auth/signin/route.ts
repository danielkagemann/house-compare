import { type NextRequest } from "next/server";
import db from "@/lib/db";
import { sendEMail } from "@/lib/email";

function generateLinkToken(len: number = 30) {
  return [...Array(len)].map(() => Math.random().toString(36)[2]).join("");
}

/**
 * api/signin
 * application data { email: string }
 */
export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Keine EMail angegeben." }), {
      status: 400,
    });
  }

  // search in database for email
  const user = db
    .prepare("SELECT access FROM USER WHERE email = ?")
    .get(email) as
    | {
        access: string;
      }
    | undefined;
  // if user not found, create new user and send email with token
  if (!user) {
    const insert = db
      .prepare(
        "INSERT INTO USER (email, access, editlink, sharelink) VALUES (?, ?, ?, ?)"
      )
      .run(
        email,
        generateLinkToken(6),
        generateLinkToken(),
        generateLinkToken()
      );

    const newUser = db
      .prepare("SELECT * FROM USER WHERE id = ?")
      .get(insert.lastInsertRowid) as {
      id: number;
      email: string;
      access: string;
      editlink: string;
      sharelink: string;
    };

    // send email with token logic here
    sendEMail(email, `Dein Bestätigungs-Code lautet: ${newUser.access}`);

    return new Response(null, {
      status: 204,
    });
  }
  return new Response(JSON.stringify({ token: user.access }), {
    status: 200,
  });
}
