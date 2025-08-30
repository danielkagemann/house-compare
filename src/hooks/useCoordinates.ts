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

  return {
    fromAddress,
  };
};
