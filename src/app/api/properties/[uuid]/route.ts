import { type NextRequest } from "next/server";
import db, { getUserIdFromAccessToken } from "@/lib/db";
import { Listing } from "@/model/Listing";

export async function GET(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const accessToken = req.headers.get("Authorization")?.split(" ")[1];
  const userId = getUserIdFromAccessToken(accessToken);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Nicht berechtigt" }), {
      status: 401,
    });
  }

  // get the listing for the given uuid
  const listing = db
    .prepare("SELECT * FROM LISTING WHERE uuid = ? AND userId = ?")
    .get(params.uuid, userId) as Listing;

  if (!listing) {
    return new Response(JSON.stringify({ error: "Objekt nicht gefunden" }), {
      status: 404,
    });
  }

  // parse json fields
  listing.location = JSON.parse(listing.location as unknown as string);
  listing.features = JSON.parse(listing.features as unknown as string);

  return new Response(JSON.stringify(listing), {
    status: 200,
  });
}

/**
 * POST api/properties
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const listing = await request.json();

  const insert = db
    .prepare(
      `
    INSERT INTO LISTING 
    (uuid, title, url, price, sqm, rooms, location, image, description, contact, year, features, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    )
    .run(
      listing.uuid,
      listing.title,
      listing.url,
      listing.price,
      listing.sqm,
      listing.rooms,
      JSON.stringify(listing.location),
      listing.image,
      listing.description,
      listing.contact,
      listing.year,
      JSON.stringify(listing.features),
      listing.notes
    );

  const newListing = db
    .prepare("SELECT * FROM LISTING WHERE uuid = ?")
    .get(listing.uuid);

  return new Response(JSON.stringify(newListing), {
    status: 201,
  });
}

/**
 * DELETE api/properties
 * @param request
 * @returns
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");

  if (!uuid) {
    return new Response(JSON.stringify({ error: "Keine UUID angegeben." }), {
      status: 400,
    });
  }

  db.prepare("DELETE FROM LISTING WHERE uuid = ?").run(uuid);

  return new Response(null, {
    status: 204,
  });
}
