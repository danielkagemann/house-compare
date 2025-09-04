import { Coordinates } from "@/model/Listing";

export const useCoordinates = () => {
  const fromAddress = async (direction: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      direction
    )}&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "house-compare/1.0",
      },
    });
    const data = await res.json();

    if (data.length === 0) throw new Error("Keine Koordinaten gefunden");
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  };

  const distanceBetween = (from: Coordinates, to: Coordinates) => {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(to.lat - from.lat);
    const dLon = toRad(to.lon - from.lon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(from.lat)) *
        Math.cos(toRad(to.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // result in km
  };

  return {
    fromAddress,
    distanceBetween,
  };
};
