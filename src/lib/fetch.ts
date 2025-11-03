import { useStorage } from "@/context/storage-provider";
import { Listing, Location } from "@/model/Listing";
import { useQuery } from "@tanstack/react-query";

const BASE = "https://villaya.de";

/**
 * fetch all properties from the api
 * @returns
 */

export const useGetPropertyList = (onlySelected: boolean = false) => {
  const $storage = useStorage();

  return useQuery({
    queryKey: ["properties", $storage.token, onlySelected, $storage.selected],
    queryFn: async () => {
      if (!$storage.token) {
        return [];
      }
      const res = await fetch(`${BASE}/api/properties/`, {
        headers: {
          Authorization: `Bearer ${$storage.token}`,
        },
      });
      if (!res.ok) {
        return [];
      }
      const data = await res.json();

      if (onlySelected) {
        const ls: Listing[] = [];
        console.log("only selected", $storage.selected);
        for (const uuid of $storage.selected) {
          const item = data.find((l: Listing) => l.uuid.trim() === uuid.trim());
          if (item) {
            ls.push(item);
          }
        }
        return ls;
      }
      return data;
    },
  });
};

/**
 * get shared list
 * @param token
 * @returns
 */
export const useGetSharedPropertyList = (share: string | null) => {
  return useQuery({
    queryKey: ["shared-properties", share],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/properties/shared/?from=${share}`);
      const data = await res.json();
      return data;
    },
    enabled: !!share,
  });
};

/**
 * get property details
 * @param uuid
 * @param token
 * @returns
 */
export const useGetPropertyDetails = (uuid: string | null) => {
  const $storage = useStorage();

  return useQuery({
    queryKey: ["property", uuid, $storage.token],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/properties/details/?uuid=${uuid}`, {
        headers: {
          Authorization: `Bearer ${$storage.token}`,
        },
      });
      const data = await res.json();
      return data;
    },
    enabled: !!uuid && !!$storage.token,
  });
};

/**
 * save or update property
 * @param listing
 * @param token
 */
async function propertySet(listing: Listing, token: string): Promise<boolean> {
  const res = await fetch(
    `${BASE}/api/properties/details/?uuid=${listing.uuid}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listing),
    }
  );
  return res.ok;
}

/**
 * get image from backend and return as base64 string
 * @param url
 * @returns
 */
async function imageProxy(url: string): Promise<string> {
  try {
    const res = await fetch(
      `${BASE}/api/properties/image/?url=${encodeURIComponent(url)}`
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
  } catch (error) {
    console.error("Error in imageProxy:", error);
    return "";
  }
}

/**
 * get location with logic if from address or from coordinates
 * @param query
 * @returns
 */
async function locationLookup(query: string): Promise<Location | null> {
  try {
    const result = await fetch(
      `${BASE}/api/properties/location/?q=${encodeURIComponent(query)}`
    );
    if (!result.ok) {
      return null;
    }
    return result.json();
  } catch (error) {
    console.error("Error in locationLookup:", error);
    return null;
  }
}
/**
 * delete a property
 * @param uuid
 * @param token
 * @returns
 */
async function propertyDelete(uuid: string, token: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/properties/details/?uuid=${uuid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
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
  const res = await fetch(`${BASE}/api/auth/validate-token/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.status === 204;
}

async function authSignIn(email: string): Promise<Response> {
  const response = await fetch(`${BASE}/api/auth/signin/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return response;
}

async function authVerifyCode(code: string): Promise<Response> {
  const response = await fetch(`${BASE}/api/auth/verify-code/?code=${code}`, {
    method: "GET",
  });
  return response;
}

async function authRemove(token: string): Promise<Response> {
  const response = await fetch(`${BASE}/api/auth/remove/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

async function authShare(token: string): Promise<string | null> {
  const response = await fetch(`${BASE}/api/auth/share/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data.share;
  }

  return null;
}

export const Endpoints = {
  propertySet,
  propertyDelete,
  imageProxy,
  locationLookup,
  isAuthenticated,
  authSignIn,
  authVerifyCode,
  authRemove,
  authShare,
};
