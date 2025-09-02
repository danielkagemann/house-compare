"use client";

import { Listing, LISTING_AVAILABLE_ATTRIBUTES } from "@/model/Listing";
import { useEffect, useState } from "react";
import { useToast } from "./useToast";

const STORAGEKEY = "listings";

export const useStorage = () => {
  // hooks
  const { showToast } = useToast();

  // state
  const [list, setList] = useState<Listing[]>([]);

  const _update = (values: Listing[]) => {
    setList(values);
    localStorage.setItem(STORAGEKEY, JSON.stringify(values));
  };

  // initial load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGEKEY) ?? "[]";
    const json = JSON.parse(raw);
    setList(json);
  }, []);

  const exportAsJson = (filename = "listings.json") => {
    const dataStr = JSON.stringify(list, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    showToast("Datei wurde heruntergeladen");
  };

  const importJson = (data: string) => {
    try {
      const json = JSON.parse(data);
      if (Array.isArray(json)) {
        // validate minimal
        const isValid = json.every((item) =>
          LISTING_AVAILABLE_ATTRIBUTES.every((attr) => attr in item)
        );
        if (isValid) {
          _update(json);
          showToast("Immobilien wurden importiert");
        } else {
          showToast("Die Datei hat nicht die korrekten Attribute.");
        }
      } else {
        showToast("Die Datei ist nicht im korrekten Format.");
      }
    } catch {
      showToast("Die Datei ist keine valide JSON Datei");
    }
  };

  return {
    add: (val: Listing) => {
      const newValues = [...list, val];
      _update(newValues);
      showToast("Immobilie hinzugefügt");
    },
    remove: (id: string) => {
      const newValues = list.filter((item) => item.uuid !== id);
      _update(newValues);
      showToast("Immobilie entfernt");
    },
    clear: () => {
      _update([]);
      showToast("Alle Immobilien entfernt");
    },
    exportAsJson,
    importJson,
    list,
  };
};
