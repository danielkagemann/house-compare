// "use client";

// import {
//   Coordinates,
//   Listing,
//   LISTING_AVAILABLE_ATTRIBUTES,
// } from "@/model/Listing";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export const useStorageInternal = () => {

//   /**
//    * export json to file
//    * @param filename
//    */
//   const exportAsJson = (filename = "listings.json") => {
//     const dataStr = JSON.stringify(listings, null, 2);
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success("Datei wurde heruntergeladen");
//   };

//   /**
//    * import from file
//    * @param data
//    */
//   const importJson = (data: string) => {
//     try {
//       const json = JSON.parse(data);
//       if (Array.isArray(json)) {
//         // validate minimal
//         const isValid = json.every((item) =>
//           LISTING_AVAILABLE_ATTRIBUTES.every((attr) => attr in item)
//         );
//         if (isValid) {
//           setListings(json);
//           localStorage.setItem(KEY.LISTINGS, JSON.stringify(json));
//           toast.success("Immobilien wurden importiert");
//         } else {
//           toast.error("Die Datei hat nicht die korrekten Attribute.");
//         }
//       } else {
//         toast.error("Die Datei ist nicht im korrekten Format.");
//       }
//     } catch {
//       toast.error("Die Datei ist keine valide JSON Datei");
//     }
//   };

//   return {
//     /// location based
//     locationSet: (coords: Coordinates | null) => {
//       setLocation(coords);
//       localStorage.setItem(KEY.LOCATION, JSON.stringify(coords));
//     },
//     location,

//     /// selection based
//     selectionAdd: (id: string) => {
//       const newValues = Array.from(new Set([...selected, id]));
//       setSelected(newValues);
//       localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
//     },
//     selectionRemove: (id: string) => {
//       const newValues = selected.filter((item) => item !== id);
//       setSelected(newValues);
//       localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
//     },
//     selectionToggle: (id: string) => {
//       const isSelected = selected.includes(id);
//       if (isSelected) {
//         const newValues = selected.filter((item) => item !== id);
//         setSelected(newValues);
//         localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
//       } else {
//         const newValues = Array.from(new Set([...selected, id]));
//         setSelected(newValues);
//         localStorage.setItem(KEY.SELECTED, JSON.stringify(newValues));
//       }
//     },
//     selectionContains: (id: string) => selected.includes(id),
//     getSelected: () => selected,

//     /// listing based
//     listingAdd: (val: Listing) => {
//       const newValues = [...listings, val];
//       setListings(newValues);
//       localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
//       toast.success("Immobilie hinzugefügt");
//     },
//     listingRemove: (id: string) => {
//       const newValues = listings.filter((item) => item.uuid !== id);
//       setListings(newValues);
//       localStorage.setItem(KEY.LISTINGS, JSON.stringify(newValues));
//       toast.success("Immobilie entfernt");
//     },
//     listingClear: () => {
//       setListings([]);
//       localStorage.setItem(KEY.LISTINGS, JSON.stringify([]));
//       toast.success("Alle Immobilien entfernt");
//     },
//     getListings: () => listings,

//     // data routines
//     exportAsJson,
//     importJson,
//   };
// };
