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
  pricePerSqm: string;
  features: string[];
};

export const LISTING_AVAILABLE_ATTRIBUTES = [
  "image",
  "title",
  "location",
  "year",
  "description",
  "price",
  "sqm",
  "pricePerSqm",
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
    pricePerSqm: "Quad. Preis",
    features: "Eigenschaften",
  };
  return mapper[attr] ?? attr;
}
