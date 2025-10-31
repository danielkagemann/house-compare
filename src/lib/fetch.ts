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
async function propertySet(listing: Listing, token: string): Promise<boolean> {
  const res = await fetch(`/api/properties/${listing.uuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Authentication ${token}`,
    },
    body: JSON.stringify(listing),
  });
  return res.ok;
}

/**
 * get image from backend and return as base64 string
 * @param url
 * @returns
 */
async function imageProxy(url: string): Promise<string> {
  const res = await fetch(
    `/api/properties/image?url=${encodeURIComponent(url)}`
  );
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

/**
 * get location with logic if from address or from coordinates
 * @param query
 * @returns
 */
async function locationLookup(query: string): Promise<Location | null> {
  const result = await fetch(
    `/api/properties/location?q=${encodeURIComponent(query)}`
  );
  if (!result.ok) {
    return null;
  }
  return result.json();
}

/**
 * delete a properti
 * @param uuid
 * @param token
 * @returns
 */
async function propertyDelete(uuid: string, token: string): Promise<boolean> {
  const res = await fetch(`/api/properties/${uuid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Authentication ${token}`,
    },
  });
  return res.ok;
}

/**
 * check if given token is valid
 * @param token
 * @returns
 */
async function isAuthenticated(token: string): Promise<boolean> {
  const res = await fetch(`/api/auth/validate-token`, {
    method: "GET",
    headers: {
      Authorization: `Authentication ${token}`,
    },
  });
  return res.status === 204;
}

export const Endpoints = {
  propertyList,
  propertyGet,
  propertySet,
  propertyDelete,
  imageProxy,
  locationLookup,
  isAuthenticated,
};
