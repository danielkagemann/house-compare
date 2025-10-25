export type Coordinates = {
  lat: number;
  lon: number;
};

export type Listing = {
  uuid: string;
  url: string;
  title: string;
  location: string;
  price: string;
  sqm: string;
  rooms: string;
  image: string;
  description: string;
  contact: string;
  year: string;
  features: string[];
  coordinates?: Coordinates;
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

export function listingAttributeToText(attr: string): string {
  const mapper: Record<string, string> = {
    uuid: "ID",
    url: "Link",
    title: "Titel",
    location: "Standort",
    price: "Preis",
    sqm: "Wohnfläche",
    rooms: "Schlafzimmer",
    image: "Bild",
    description: "Beschreibung",
    contact: "Makler",
    year: "Baujahr",
    features: "Eigenschaften",
  };
  return mapper[attr] ?? attr;
}

export function getSquareMeterPrice(price: string, sqm: string): string {
  const priceNum = parseFloat(price.replace(/\./g, '').replace(',', '.'));
  const sqmNum = parseFloat(sqm.replace(/\./g, '').replace(',', '.'));
  if (!isNaN(priceNum) && !isNaN(sqmNum) && sqmNum > 0) {
     const pricePerSqm = Math.round(priceNum / sqmNum);
     return `€ ${pricePerSqm.toLocaleString()}`;
  }
  return '--';
}