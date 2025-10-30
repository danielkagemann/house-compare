import { createContext, useContext, useEffect, useState } from "react";
import { Location } from "@/model/Listing";
import { toast } from "sonner";
import { FilterOptions } from "@/model/filter";
import { User } from "@/model/user";

interface StorageContextType {
   // importJson: (data: string) => void;
   // exportAsJson: (filename?: string) => void;
   location: Location | null;
   selected: string[];
   selectionToggle: (id: string) => void;
   selectionContains: (id: string) => boolean;
   locationSet: (loc: Location | null) => void;
   filter: FilterOptions;
   filterUpdate: (filter: FilterOptions) => void;
   user: User | null;
   userSet: (user: User | null) => void;
}

const StorageContext = createContext<StorageContextType | null>(null);

const KEY = { USER: 'usr', FILTER: 'flt', SELECTED: "sel" };

export const StorageProvider = ({ children }: { children: React.ReactNode }) => {
   // state
   const [user, setUser] = useState<User | null>(null);
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
         setUser(JSON.parse(usr) ?? null);
      }

      const sel = localStorage.getItem(KEY.SELECTED) ?? "[]";
      setSelected(JSON.parse(sel));
   }, []);

   /**
   * export json to file
   * @param filename
   */
   const exportAsJson = (filename = "listings.json") => {
      // const dataStr = JSON.stringify(listings, null, 2);
      // const blob = new Blob([dataStr], { type: "application/json" });
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = filename;
      // link.click();
      // URL.revokeObjectURL(url);
      // toast.success("Datei wurde heruntergeladen");
      // TODO export
   };

   /**
    * import from file
    * @param data
    */
   const importJson = (data: string) => {
      // try {
      //    const json = JSON.parse(data);
      //    if (Array.isArray(json)) {
      //       // validate minimal
      //       const isValid = json.every((item) =>
      //          LISTING_AVAILABLE_ATTRIBUTES.every((attr) => attr in item)
      //       );
      //       if (isValid) {
      //          setListings(json);
      //          localStorage.setItem(KEY.LISTINGS, JSON.stringify(json));
      //          toast.success("Immobilien wurden importiert");
      //       } else {
      //          toast.error("Die Datei hat nicht die korrekten Attribute.");
      //       }
      //    } else {
      //       toast.error("Die Datei ist nicht im korrekten Format.");
      //    }
      // } catch {
      //    toast.error("Die Datei ist keine valide JSON Datei");
      // }
      // TODO import
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

   const userSet = (usr: User | null) => {
      setUser(usr);
      if (usr) {
         localStorage.setItem(KEY.USER, JSON.stringify(usr));
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
      user,
      userSet,
   }}>
      {children}
   </StorageContext.Provider>;
};

export const useStorage = () => {
   const ctx = useContext(StorageContext);
   if (!ctx) throw new Error("useStorage must be used inside StorageProvider");
   return ctx;
};
