"use client";

import {
  Coordinates,
  Listing,
  LISTING_AVAILABLE_ATTRIBUTES,
} from "@/model/Listing";
import { useEffect, useState } from "react";
import { useCoordinates } from "./useCoordinates";
import { toast } from "sonner";

const KEY = { LISTINGS: "lst", LOCATION: "loc", SELECTED: "sel" };

export const useStorage = () => {
  // hooks
  const $coords = useCoordinates();

  // state
  const [listings, setListings] = useState<Listing[]>([]);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // const _update = (values: Listing[]) => {
  //   setList(values);

  //   // async Funktion im useEffect definieren
  //   async function updateData() {
  //     const updated: Listing[] = [];

  //     for (const item of values) {
  //       // updat sqm price
  //       if (item.price && item.sqm) {
  //         const priceNum = parseFloat(item.price);
  //         const sqmNum = parseFloat(item.sqm);
  //         item.pricePerSqm =
  //           !isNaN(priceNum) && !isNaN(sqmNum) && sqmNum > 0
  //             ? Math.round(priceNum / sqmNum) + " €"
  //             : "";
  //       }

  //       if (item.coordinates === undefined && item.location) {
  //         try {
  //           const res = await $coords.fromAddress(item.location);
  //           updated.push({ ...item, coordinates: res });
  //         } catch (err) {
  //           console.error("Fehler bei Request:", err);
  //           updated.push(item);
  //         }
  //       } else {
  //         updated.push(item);
  //       }
  //     }
  //     setList(updated);
  //     localStorage.setItem(STORAGEKEY, JSON.stringify(updated));
  //   }

  //   // execute the async function
  //   updateData();
  // };

  // initial load
  useEffect(() => {
    const lraw = localStorage.getItem(KEY.LISTINGS) ?? "[]";
    setListings(JSON.parse(lraw));

    const loc = localStorage.getItem(KEY.LOCATION) ?? null;
    setLocation(loc ? JSON.parse(loc) : null);

    const sel = localStorage.getItem(KEY.SELECTED) ?? "[]";
    setSelected(JSON.parse(sel));
  }, []);

  /**
   * export json to file
   * @param filename
   */
  const exportAsJson = (filename = "listings.json") => {
    // TODO export data
    // const dataStr = JSON.stringify(storageData, null, 2);
    // const blob = new Blob([dataStr], { type: "application/json" });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = filename;
    // link.click();
    // URL.revokeObjectURL(url);
    // toast.success("Datei wurde heruntergeladen");
  };

  /**
   * import from file
   * @param data
   */
  const importJson = (data: string) => {
    // TODO implement import
    // try {
    //   const json = JSON.parse(data);
    //   if (Array.isArray(json)) {
    //     // validate minimal
    //     const isValid = json.every((item) =>
    //       LISTING_AVAILABLE_ATTRIBUTES.every((attr) => attr in item)
    //     );
    //     if (isValid) {
    //       _update(json);
    //       showToast("Immobilien wurden importiert");
    //     } else {
    //       showToast("Die Datei hat nicht die korrekten Attribute.");
    //     }
    //   } else {
    //     showToast("Die Datei ist nicht im korrekten Format.");
    //   }
    // } catch {
    //   showToast("Die Datei ist keine valide JSON Datei");
    // }
  };

  return {
    /// location based
    locationSet: (coords: Coordinates | null) => {
      setLocation(coords);
      localStorage.setItem(KEY.LOCATION, JSON.stringify(coords));
    },
    location,

    /// selection based
    selectionAdd: (id: string) => {
      const newValues = Array.from(new Set([...selected, id]));
      setSelected(newValues);
      localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
    },
    selectionRemove: (id: string) => {
      const newValues = selected.filter((item) => item !== id);
      setSelected(newValues);
      localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
    },

    /// listing based
    listingAdd: (val: Listing) => {
      const newValues = [...listings, val];
      setListings(newValues);
      localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
      toast.success("Immobilie hinzugefügt");
    },
    listingRemove: (id: string) => {
      const newValues = listings.filter((item) => item.uuid !== id);
      setListings(newValues);
      localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
      toast.success("Immobilie entfernt");
    },
    listingClear: () => {
      setListings([]);
      localStorage.setItem(KEY.LISTINGS, JSON.stringify([]));
      toast.success("Alle Immobilien entfernt");
    },
    listings,

    // data routines
    exportAsJson,
    importJson,
  };
};
