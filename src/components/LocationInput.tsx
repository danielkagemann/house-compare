import { CircleX, MapPinHouse, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useStorage } from "@/context/storage-provider";
import { Input } from "./ui/input";
import { flushSync } from "react-dom";
import { Spinner } from "./ui/spinner";
import { Tooltip } from "./ui/Tooltip";
import { Endpoints } from "@/lib/fetch";
import { Listing } from "@/model/Listing";

export const LocationInput = () => {
   // hooks
   const $storage = useStorage();

   // states
   const [fromLocation, setFromLocation] = useState<string>($storage.location?.display ?? '');
   const [enterLocation, setEnterLocation] = useState<boolean>(false);
   const [working, setWorking] = useState<boolean>(false);
   const [listings, setListings] = useState<Listing[]>([]);

   useEffect(() => {
      if ($storage.token && $storage.token.length > 0) {
         Endpoints.propertyList($storage.token).then((data) => {
            setListings(data);
         });
      }
   }, [$storage.token]);

   if (listings.length === 0) {
      return null;
   }

   if (!enterLocation) {
      const hasLocation = fromLocation.length > 0;
      return (
         <Tooltip text={hasLocation ? fromLocation : "Startpunkt für Entfernungsangaben festlegen"}>
            <Button variant="outline"
               onClick={() => setEnterLocation(true)}><MapPinHouse size={14} />
               {hasLocation ? fromLocation.substring(0, 15) : 'Startpunkt'}
            </Button>
         </Tooltip>
      );
   }

   async function onLocationCheck() {
      if (fromLocation.length === 0) {
         return;
      }

      flushSync(() => {
         setWorking(true);
      });

      const result = await Endpoints.locationLookup(fromLocation);

      if (!result) {
         $storage.locationSet(null);
         toast.error("Fehler: Keine Koordinaten gefunden");
      } else {
         $storage.locationSet(result);
         setFromLocation(result.display);
         console.log(result);
         setEnterLocation(false);
      }
      setWorking(false);
   }

   return <div className="flex gap-1 items-center">
      <Input type="text"
         placeholder="Ort oder Adresse eingeben"
         value={fromLocation}
         onChange={(e) => {
            setFromLocation(e.target.value);
         }} />
      {working ? <Spinner /> : (<>
         <Button variant="default"
            className="bg-primary text-white disabled:text-gray-700 disabled:bg-gray-300"
            disabled={fromLocation.length === 0}
            onClick={onLocationCheck}>
            <Search size={14} />
         </Button>
         <Button variant="outline" onClick={() => setEnterLocation(false)}><CircleX size={14} /></Button>
      </>)}
   </div >;
};