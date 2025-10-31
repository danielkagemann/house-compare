import { type NextRequest } from "next/server";
import db, { getUserIdFromAccessToken } from "@/lib/db";

/**
 * GET api/properties
 */
export async function GET(request: NextRequest) {
  // get accesstoken from header
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  const userId = getUserIdFromAccessToken(accessToken);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Nicht berechtigt" }), {
      status: 401,
    });
  }

  let listings = db
    .prepare("SELECT * FROM LISTING where userId = ?")
    .all(userId) as any[];

  if (!Array.isArray(listings)) {
    listings = [listings];
  }
  console.log("listings:", listings.length);

  if (listings) {
    // convert json data back to object
    listings.forEach((listing) => {
      listing.location = JSON.parse(listing.location);
      listing.features = JSON.parse(listing.features);
    });
  }

  return new Response(JSON.stringify(listings ?? []), {
    status: 200,
  });
}
