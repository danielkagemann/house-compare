import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  const { html } = await req.json();

  if (!html) {
    return NextResponse.json({ error: "Kein HTML übergeben" }, { status: 400 });
  }

  try {
    const $ = cheerio.load(html);

    const title = $(".main-info__title-main").text().trim();
    const location = $(".main-info__title-minor").text().trim();
    const price = $(".info-data-price").text().trim();
    const sqm =
      $(".info-features span")
        .filter((_, el) => $(el).text().includes("m²"))
        .first()
        .text()
        .trim() || "";

    const rooms =
      $(".info-features span")
        .filter((_, el) => $(el).text().toLowerCase().includes("schlaf"))
        .first()
        .text()
        .trim() || "";

    const image = $(".first-image img").attr("src") || "";
    const description = $(".comment").text().trim();
    const contact = $(".advertiser-name-container").text().trim();

    const features: string[] = [];

    const sections = $(".details-property_features").slice(0, -1);
    let year = "";
    sections.each((_, el) => {
      $(el)
        .find("li")
        .each((_, li) => {
          const value = $(li).text().trim();
          if (value.toLowerCase().startsWith("baujahr")) {
            year = value.match(/\d+/)?.[0] ?? "";
          } else {
            features.push(value);
          }
        });
    });

    const uuid: string = new Date().getTime().toString();

    return NextResponse.json({
      uuid,
      title,
      location,
      price,
      sqm,
      rooms,
      image,
      description,
      contact,
      features,
      year,
    });
  } catch (error) {
    console.error("Parse-Fehler:", error);
    return NextResponse.json(
      { error: "Fehler beim Parsen", details: `${error}` },
      { status: 500 }
    );
  }
}
