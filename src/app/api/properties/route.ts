import { type NextRequest } from "next/server";
import db from "@/lib/db";

/**
 * GET api/properties
 */
export async function GET(request: NextRequest) {
  const listings = db.prepare("SELECT * FROM LISTING").all() as any[];

  return new Response(JSON.stringify(listings), {
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
