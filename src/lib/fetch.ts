import { Listing, Location } from "@/model/Listing";

/**
 * fetch all properties from the api
 * @returns
 */
async function propertyList(token: string): Promise<Listing[]> {
  const res = await fetch("/api/properties", {
    headers: {
      Authorization: `Authentication ${token}`,
    },
  });
  const data = await res.json();
  return data;
}

/**
 * get property details
 * @param uuid
 * @param token
 * @returns
 */
async function propertyGet(uuid: string, token: string): Promise<Listing> {
  const res = await fetch(`/api/properties/${uuid}`, {
    headers: {
      Authorization: `Authentication ${token}`,
    },
  });
  const data = await res.json();
  return data;
}

/**
 * save or update property
 * @param listing
 * @param token
 */
async function propertySet(listing: Listing, token: string): Promise<void> {
  const res = await fetch(`/api/properties/${listing.uuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Authentication ${token}`,
    },
    body: JSON.stringify(listing),
  });
  if (!res.ok) {
    return;
  }
}

async function imageProxy(url: string): Promise<string> {
  const res = await fetch(`/api/image?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Image not found");
  const blob = await res.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      const base64Image = e.target?.result as string;
      resolve(base64Image);
    };
    reader.onerror = function () {
      reject(new Error("Failed to read image"));
    };
    reader.readAsDataURL(blob);
  });
}

async function locationLookup(query: string): Promise<Location | null> {
  const result = await fetch(`/api/location?q=${encodeURIComponent(query)}`);
  if (!result.ok) {
    return null;
  }
  return result.json();
}

export const Endpoints = {
  propertyList,
  propertyGet,
  propertySet,
  imageProxy,
  locationLookup,
};
