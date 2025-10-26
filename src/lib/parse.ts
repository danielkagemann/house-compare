import { Listing } from "@/model/Listing";

export function parseHtml(html: string): Listing | null {
  if (!html) {
    return null;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const title =
    doc.querySelector(".main-info__title-main")?.textContent?.trim() || "";
  const location =
    doc.querySelector(".main-info__title-minor")?.textContent?.trim() || "";
  const price =
    doc.querySelector(".info-data-price")?.textContent?.trim() || "";

  const sqm =
    Array.from(doc.querySelectorAll(".info-features span"))
      .find((el) => el.textContent?.includes("m²"))
      ?.textContent?.trim() || "";

  const rooms =
    Array.from(doc.querySelectorAll(".info-features span"))
      .find((el) => el.textContent?.toLowerCase().includes("schlaf"))
      ?.textContent?.trim() || "";

  const image =
    doc.querySelector(".first-image img")?.getAttribute("src") || "";
  const description = doc.querySelector(".comment")?.textContent?.trim() || "";
  const contact =
    doc.querySelector(".advertiser-name-container")?.textContent?.trim() || "";

  const features: string[] = [];
  let year = "";

  const sections = Array.from(
    doc.querySelectorAll(".details-property_features")
  ).slice(0, -1);

  sections.forEach((section) => {
    Array.from(section.querySelectorAll("li")).forEach((li) => {
      const value = li.textContent?.trim() || "";
      if (value.toLowerCase().startsWith("baujahr")) {
        const match = value.match(/\d+/);
        if (match) year = match[0];
      } else {
        features.push(value);
      }
    });
  });

  const uuid = new Date().getTime().toString();

  const priceNum = parseFloat(price.replace(/[^\d]/g, ""));
  const sqmNum = parseFloat(sqm.replace(/[^\d]/g, ""));
  const pricePerSqm =
    !isNaN(priceNum) && !isNaN(sqmNum) && sqmNum > 0
      ? Math.round(priceNum / sqmNum) + " €"
      : "";

  return {
    uuid,
    title,
    location,
    price: parseFloat(price.replace(/[^\d]/g, "")).toString(),
    sqm: parseFloat(sqm.replace(/[^\d]/g, "")).toString(),
    rooms: parseFloat(rooms.replace(/[^\d]/g, "")).toString(),
    image,
    description,
    contact,
    features,
    year,
    url: "",
  };
}
