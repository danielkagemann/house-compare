import { createContext, useContext, useEffect, useState } from "react";
import { Coordinates, Location, Listing, LISTING_AVAILABLE_ATTRIBUTES } from "@/model/Listing";
import { toast } from "sonner";
import { FilterOptions } from "@/model/filter";

interface StorageContextType {
   importJson: (data: string) => void;
   exportAsJson: (filename?: string) => void;
   listings: Listing[];
   location: Location | null;
   selected: string[];
   listingAdd: (val: Listing) => void;
   listingUpdate: (val: Listing) => void;
   listingRemove: (id: string) => void;
   listingClear: () => void;
   selectionToggle: (id: string) => void;
   selectionContains: (id: string) => boolean;
   locationSet: (loc: Location | null) => void;
   filter: FilterOptions;
   filterUpdate: (filter: FilterOptions) => void;
}

const StorageContext = createContext<StorageContextType | null>(null);

const KEY = { LISTINGS: "lst", FILTER: 'flt', SELECTED: "sel" };

export const StorageProvider = ({ children }: { children: React.ReactNode }) => {
   // state
   const [listings, setListings] = useState<Listing[]>([]);
   const [location, setLocation] = useState<Location | null>(null);
   const [selected, setSelected] = useState<string[]>([]);
   const [flt, setFilter] = useState<FilterOptions>({
      compactView: false,
      removeFromList: false,
      maxPrice: 0,
      minArea: 0,
   });

   // initial load
   useEffect(() => {
      const lraw = localStorage.getItem(KEY.LISTINGS) ?? "[]";
      setListings(JSON.parse(lraw));

      const flt = localStorage.getItem(KEY.FILTER) ?? "{}";
      setFilter(JSON.parse(flt));

      const sel = localStorage.getItem(KEY.SELECTED) ?? "[]";
      setSelected(JSON.parse(sel));
   }, []);

   /**
   * export json to file
   * @param filename
   */
   const exportAsJson = (filename = "listings.json") => {
      const dataStr = JSON.stringify(listings, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Datei wurde heruntergeladen");
   };

   /**
    * import from file
    * @param data
    */
   const importJson = (data: string) => {
      try {
         const json = JSON.parse(data);
         if (Array.isArray(json)) {
            // validate minimal
            const isValid = json.every((item) =>
               LISTING_AVAILABLE_ATTRIBUTES.every((attr) => attr in item)
            );
            if (isValid) {
               setListings(json);
               localStorage.setItem(KEY.LISTINGS, JSON.stringify(json));
               toast.success("Immobilien wurden importiert");
            } else {
               toast.error("Die Datei hat nicht die korrekten Attribute.");
            }
         } else {
            toast.error("Die Datei ist nicht im korrekten Format.");
         }
      } catch {
         toast.error("Die Datei ist keine valide JSON Datei");
      }
   };

   const listingAdd = (val: Listing) => {
      const newValues = [...listings, val];
      setListings(newValues);
      localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
      toast.success("Immobilie hinzugefügt");
   };

   const listingUpdate = (val: Listing) => {
      const index = listings.findIndex((item) => item.uuid.trim() === val.uuid.trim());
      if (index !== -1) {
         const newValues = [...listings];
         newValues[index] = val;
         setListings(newValues);
         localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
      }
   };

   const listingRemove = (id: string) => {
      const newValues = listings.filter((item) => item.uuid.trim() !== id.trim());
      setListings(newValues);
      localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
      toast.success("Immobilie entfernt");

      // check if this is in selection
      if (selectionContains(id)) {
         const newSelection = selected.filter((item) => item.trim() !== id.trim());
         setSelected(newSelection);
         localStorage.setItem(KEY.SELECTED, JSON.stringify(newSelection));
      }
   };

   const listingClear = () => {
      setListings([]);
      localStorage.setItem(KEY.LISTINGS, JSON.stringify([]));
      toast.success("Alle Immobilien entfernt");
   };

   const selectionToggle = (id: string) => {
      const isSelected = selected.includes(id.trim());
      if (isSelected) {
         const newValues = selected.filter((item) => item.trim() !== id.trim());
         setSelected(newValues);
         localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
      } else {
         const newValues = Array.from(new Set([...selected, id.trim()]));
         if (newValues.length > 3) {
            toast.error("Es können maximal 3 Immobilien zum Vergleich ausgewählt werden.");
         } else {
            setSelected(newValues);
            localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
         }
      }
   };

   const selectionContains = (id: string) => selected.includes(id.trim());

   const locationSet = (loc: Location | null) => {
      setLocation(loc);
   };

   const filterUpdate = (filter: FilterOptions) => {
      setFilter(filter);
      localStorage.setItem(KEY.FILTER, JSON.stringify(filter));
   };

   return <StorageContext.Provider value={{
      importJson,
      exportAsJson,
      listings,
      location,
      selected,
      listingAdd,
      listingRemove,
      listingUpdate,
      listingClear,
      selectionToggle,
      selectionContains,
      locationSet,
      filter: flt,
      filterUpdate
   }}>
      {children}
   </StorageContext.Provider>;
};

export const useStorage = () => {
   const ctx = useContext(StorageContext);
   if (!ctx) throw new Error("useStorage must be used inside StorageProvider");
   return ctx;
};
