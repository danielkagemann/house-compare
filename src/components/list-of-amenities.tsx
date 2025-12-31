"use client";
import { amenityTitle, distanceBetweenCoordinates, Location } from "@/model/Listing";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

interface ListOfAmenitiesProps {
   item: Location;
}

type DisplayPOI = {
   name: string;
   distance: number;
}

export const ListOfAmenities = ({ item }: ListOfAmenitiesProps) => {
   // hooks
   const t = useTranslations("house");

   const types = Array.from(new Set(item.poi?.map(poi => poi.type)));

   const amenitiesForType = useCallback((type: string): DisplayPOI[] => {
      return item.poi!.filter(poi => poi.type === type)
         .map((poi) => ({
            name: poi.name || t("unknown"),
            distance: distanceBetweenCoordinates(item, poi.coordinates)
         }))
         .sort((a, b) => a.distance - b.distance);
   }, [item, t]);
   if (item.poi === undefined || item.poi.length === 0) {
      return <p>{t("noAmenities")}</p>;
   }

   return (
      <div className="text-sm mt-2">
         {
            types.map((type, idx) => (
               <div key={idx} className="mb-2">
                  <strong>{amenityTitle(type)}</strong>
                  <div className="bg-gray-100 rounded p-2 flex flex-col">
                     {amenitiesForType(type).map((amenity, aidx) => (
                        <div key={aidx}>{amenity.name} <strong>{amenity.distance.toFixed(2)}km</strong> {t("away")}</div>
                     ))}
                  </div>
               </div>
            ))
         }
      </div>
   );
};