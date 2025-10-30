import { type NextRequest } from "next/server";

/**
 * helper routine to get coordinates
 */
const fromAddress = async (direction: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    direction
  )}&limit=1`;

  console.log("trying to fetch coordinates from url:", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "house-compare/1.0",
    },
  });
  const data = await res.json();

  console.log("received data:", data);

  if (!data || data.length === 0) throw new Error("Keine Koordinaten gefunden");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
};

/**
 * helper routine to get address from coordinates including country
 * @param lat
 * @param lon
 * @returns
 */
const fromCoords = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  );

  const data = await response.json();

  console.log("---------\nreverse geocoding data:", data);

  if (!data) throw new Error("Keine Daten gefunden");

  const label = [];
  if (data.address.road) label.push(data.address.road);
  if (data.address.postcode) label.push(data.address.postcode);
  if (data.address.village) label.push(data.address.village);
  if (data.address.town) label.push(data.address.town);

  const display = label.length === 0 ? data.address.name : label.join(", ");

  return {
    country: data.address.country,
    code: data.address.country_code,
    display,
  };
};

// ---------

/**
 * api/location?q=Alicante
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  // now try to get coordinates or address data
  if (!query) {
    return Response.json({ error: "no query information" }, { status: 400 });
  }

  // Check if query is in lat,lon format
  const latLonPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;

  try {
    if (latLonPattern.test(query)) {
      // Parse as coordinates
      const [lat, lon] = query.split(",").map(Number);

      // validate ranges
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        // get coordinates, address and country information
        const addressData = await fromCoords(lat, lon);

        return Response.json({ lat, lon, ...addressData });
      }

      return Response.json(
        { error: "Invalid coordinates range" },
        { status: 400 }
      );
    }

    // get coordinates, address and country information
    const coords = await fromAddress(query);
    const addressData = await fromCoords(coords.lat, coords.lon);

    return Response.json({ ...coords, ...addressData });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message || "Error fetching location data" },
      { status: 406 }
    );
  }
}
