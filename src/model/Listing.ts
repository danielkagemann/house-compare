export type Coordinates = {
  lat: number;
  lon: number;
};

export type POI = {
  name: string;
  type: string;
  coordinates: Coordinates;
};

export type Location = Coordinates & {
  country: string;
  code: string;
  display: string;
  poi?: POI[];
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
  score?: number;
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
  const priceNum = Number.parseFloat(
    price.replace(/\./g, "").replace(",", ".")
  );
  const sqmNum = Number.parseFloat(sqm.replace(/\./g, "").replace(",", "."));
  if (!Number.isNaN(priceNum) && !Number.isNaN(sqmNum) && sqmNum > 0) {
    const pricePerSqm = Math.round(priceNum / sqmNum);
    return `EUR ${pricePerSqm.toLocaleString()}`;
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

type Weights = {
  price: number;
  sqm: number;
  year: number;
  rooms: number;
};

export function calculateScores(
  properties: Listing[],
  weights?: Weights
): Listing[] {
  weights = weights || { price: 0.25, sqm: 0.35, year: 0.15, rooms: 0.25 };

  // precheck
  if (weights.price + weights.sqm + weights.year + weights.rooms !== 1) {
    throw new Error("Weights must sum up to 1");
  }
  const minMax = <K extends keyof Listing>(key: K) => {
    const values = properties.map((p) =>
      Number.parseFloat((p[key] as string) || "0")
    );
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const priceMM = minMax("price");
  const sqmMM = minMax("sqm");
  const yearMM = minMax("year");
  const roomsMM = minMax("rooms");

  const normalize = (value: number, min: number, max: number) => {
    if (max === min) return 1;
    return (value - min) / (max - min);
  };

  return properties.map((property) => {
    const priceScore =
      1 -
      normalize(Number.parseFloat(property.price), priceMM.min, priceMM.max);

    const sqmScore = normalize(
      Number.parseFloat(property.sqm),
      sqmMM.min,
      sqmMM.max
    );

    const yearScore = normalize(
      Number.parseFloat(property.year),
      yearMM.min,
      yearMM.max
    );

    const roomsScore = normalize(
      Number.parseFloat(property.rooms),
      roomsMM.min,
      roomsMM.max
    );

    const score =
      priceScore * weights.price +
      sqmScore * weights.sqm +
      yearScore * weights.year +
      roomsScore * weights.rooms;

    return {
      ...property,
      score: Number.isNaN(score) ? 0 : Number((score * 100).toFixed(0)),
    };
  });
}

export function amenityTitle(type: string) {
  switch (type) {
    case "supermarket":
      return "Supermärkte";
    case "restaurant":
      return "Restaurants";
    case "beach":
    case "beach_resort":
      return "Strände";
    default:
      return type;
  }
}
