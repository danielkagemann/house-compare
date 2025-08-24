"use client";

import { Listing } from "@/model/Listing";
import { useEffect, useState } from "react";

const STORAGEKEY = "listings";

export const useStorage = () => {
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

  return {
    add: (val: Listing) => {
      const newValues = [...list, val];
      _update(newValues);
    },
    remove: (id: string) => {
      const newValues = list.filter((item) => item.uuid !== id);
      _update(newValues);
    },
    clear: () => {
      _update([]);
    },
    list,
  };
};
