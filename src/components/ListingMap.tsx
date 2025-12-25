"use client";
import { useGetPropertyList } from "@/lib/fetch";
import { MarkerItem } from "./PropertiesMap";
import { useMemo } from "react";
import { Listing } from "@/model/Listing";
import dynamic from "next/dynamic";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
   ssr: false,
});


export const ListingMap = () => {
   // hooks
   const { data: listings } = useGetPropertyList();

   // derived state
   const markerList = useMemo((): MarkerItem[] => {
      return listings?.filter((item: Listing) => item.location.lat !== undefined && item.location.lon !== undefined)
         .map((prop: Listing) => ({
            coords: prop.location,
            name: prop.title || 'Unbenannte Immobilie',
            price: prop.price || 0,
            image: prop.image && prop.image.length > 0 ? prop.image : '',
         })) ?? [];
   }, [listings]);

   return <PropertiesMap listings={markerList} />;
}