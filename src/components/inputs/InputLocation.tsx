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

   function hasPOI() {
      return value.poi !== undefined && value.poi.length > 0;
   }

   return (
      <>
         <p>Bitte gib den Standort der Immobilie an. Gib die ungefähre Adresse ein oder Koordinaten in der Form Latitude,Longitude.</p>
         <div className="flex gap-1 items-center">
            <Input type="text" value={value.display} onChange={(e) => onChange({ ...value, display: e.target.value })} />
            {working ? <Spinner /> : <Button variant="outline" onClick={onFindAddr}><MapPin size={16} /></Button>}
         </div>

         <p className="text-sm">{hasCoords() ? `${value.lat}, ${value.lon} in ${value.country}` : "Keine gültige Adresse."}</p>
         {!working && <InputNext onClick={onNext} />}

         {hasCoords() && <Map location={{ lat: value.lat!, lon: value.lon! }} className="h-30" />}

         {hasPOI() && (<ListOfAmenities item={value} />)}
      </>
   );
};