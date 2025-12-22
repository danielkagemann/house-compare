import { createContext, useContext, useEffect, useState } from "react";
import { Location } from "@/model/Listing";
import { toast } from "sonner";
import { FilterOptions } from "@/model/filter";

interface StorageContextType {
   location: Location | null;
   selected: string[];
   selectionToggle: (id: string) => void;
   selectionContains: (id: string) => boolean;
   locationSet: (loc: Location | null) => void;
   filter: FilterOptions;
   filterUpdate: (filter: FilterOptions) => void;
   token: string | null;
   tokenSet: (value: string | null) => void;
}

const StorageContext = createContext<StorageContextType | null>(null);

const KEY = { USER: 'usr', FILTER: 'flt', SELECTED: "sel" };

export const StorageProvider = ({ children }: { children: React.ReactNode }) => {
   // state
   const [token, setToken] = useState<string | null>(null);
   const [selected, setSelected] = useState<string[]>([]);
   const [location, setLocation] = useState<Location | null>(null);
   const [flt, setFilter] = useState<FilterOptions>({
      compactView: false,
      removeFromList: false,
      maxPrice: 0,
      minArea: 0,
   });

   // initial load
   useEffect(() => {
      const flt = localStorage.getItem(KEY.FILTER) ?? "{}";
      setFilter(JSON.parse(flt));

      const usr = localStorage.getItem(KEY.USER);
      if (usr) {
         setToken(usr || null);
      }

      const sel = localStorage.getItem(KEY.SELECTED) ?? "[]";
      setSelected(JSON.parse(sel));
   }, []);

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

   const tokenSet = (val: string | null) => {
      setToken(val);
      if (val) {
         localStorage.setItem(KEY.USER, val);
      } else {
         localStorage.removeItem(KEY.USER);
      }
   };

   return <StorageContext.Provider value={{
      location,
      selected,
      selectionToggle,
      selectionContains,
      locationSet,
      filter: flt,
      filterUpdate,
      token,
      tokenSet,
   }}>
      {children}
   </StorageContext.Provider>;
};

export const useStorage = () => {
   const ctx = useContext(StorageContext);
   if (!ctx) throw new Error("useStorage must be used inside StorageProvider");
   return ctx;
};
