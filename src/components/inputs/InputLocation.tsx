"use client";

import { Button } from "../ui/button";
import { MapPin } from "lucide-react";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";
import { distanceBetweenCoordinates, Location } from "@/model/Listing";
import { useState } from "react";
import { flushSync } from "react-dom";
import { Spinner } from "../ui/spinner";
import { Endpoints } from "@/lib/fetch";
import dynamic from "next/dynamic";
import { ListOfAmenities } from "../list-of-amenities";
import { Skeleton } from "../ui/skeleton";

const Map = dynamic(() => import("../Map"), {
   ssr: false,
});

interface Props {
   value: Location;
   onChange: (value: Location) => void;
   onNext: () => void;
}

export const InputLocation = ({ value, onChange, onNext }: Props) => {
   // state
   const [working, setWorking] = useState(false);

   const onFindAddr = async () => {
      flushSync(() => {
         setWorking(true);
      });
      const result = await Endpoints.locationLookup(value.display);
      if (result) {

         const poiResult = await Endpoints.locationPOI(result.lat!, result.lon!);
         if (poiResult) {
            result.poi = poiResult;
         }
         onChange({ ...value, ...result });
      }
      setWorking(false);
   }

   function hasCoords() {
      return value.lat !== undefined && value.lon !== undefined && value.lat !== 0 && value.lon !== 0;
   }

   function showMap() {
      if (working) {
         return <>
            <span>Suche nach Adresse...</span>
            <Skeleton className="h-3 bg-white w-full rounded mb-1" />
            <Skeleton className="h-3 bg-white w-4/5 rounded" />
         </>;
      }
      if (!hasCoords()) {
         return null;
      }

      return (
         <Map location={{ lat: value.lat!, lon: value.lon! }} className="h-30" />
      );
   }

   function showAmenities() {
      if (working) {
         return <>
            <span>Suche nach Sehenswürdigkeiten...</span>
            <Skeleton className="h-3 bg-white w-full rounded mb-1" />
            <Skeleton className="h-3 bg-white w-4/5 rounded" />
         </>;
      }

      return (
         <ListOfAmenities item={value} />
      );
   }

   return (
      <>
         <p>Bitte gib den Standort der Immobilie an. Gib die ungefähre Adresse ein oder Koordinaten in der Form Latitude,Longitude. Es wird ebenfalls versucht, Sehenswürdigkeiten in der Nähe zu finden.</p>
         <div className="flex gap-1 items-center">
            <Input type="text" value={value.display} onChange={(e) => onChange({ ...value, display: e.target.value })} />
            {working ? <Spinner /> : <Button variant="outline" onClick={onFindAddr}><MapPin size={16} /></Button>}
         </div>

         <p className="text-sm">{hasCoords() ? `${value.lat}, ${value.lon} in ${value.country}` : "Keine gültige Adresse."}</p>
         {!working && <InputNext onClick={onNext} />}

         {showMap()}
         {showAmenities()}
      </>
   );
};