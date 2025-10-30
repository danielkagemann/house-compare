export type Coordinates = {
  lat: number;
  lon: number;
};

export type Location = Coordinates & {
  country: string;
  code: string;
  display: string;
};

export type Listing = {
  uuid: string;
  userId: number;
  creationdate: string;
  url: string;
  title: string;
  location: Location;
  price: string;
  sqm: string;
  rooms: string;
  image: string;
  description: string;
  contact: string;
  year: string;
  features: string[];
  notes: string;
};

export const LISTING_AVAILABLE_ATTRIBUTES = [
  "image",
  "title",
  "location",
  "year",
  "description",
  "price",
  "sqm",
  "rooms",
  "features",
  "contact",
];

export function getSquareMeterPrice(price: string, sqm: string): string {
  const priceNum = parseFloat(price.replace(/\./g, "").replace(",", "."));
  const sqmNum = parseFloat(sqm.replace(/\./g, "").replace(",", "."));
  if (!isNaN(priceNum) && !isNaN(sqmNum) && sqmNum > 0) {
    const pricePerSqm = Math.round(priceNum / sqmNum);
    return `€ ${pricePerSqm.toLocaleString()}`;
  }
  return "--";
}

export function distanceBetweenCoordinates(from: Coordinates, to: Coordinates) {
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
}
