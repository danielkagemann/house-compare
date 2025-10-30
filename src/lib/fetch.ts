import { Listing } from "@/model/Listing";

/**
 * fetch all properties from the api
 * @returns
 */
export async function fetchProperties(token: string): Promise<Listing[]> {
  const res = await fetch("/api/properties", {
    headers: {
      Authorization: `Authentication ${token}`,
    },
  });
  const data = await res.json();
  return data;
}

export async function fetchProperty(
  uuid: string,
  token: string
): Promise<Listing> {
  const res = await fetch(`/api/properties/${uuid}`, {
    headers: {
      Authorization: `Authentication ${token}`,
    },
  });
  const data = await res.json();
  return data;
}
