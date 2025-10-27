import { CircleX, MapPinHouse, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useStorage } from "@/context/storage-provider";
import { Input } from "./ui/input";

export const LocationInput = () => {
   // hooks
   const $storage = useStorage();

   // states
   const [fromLocation, setFromLocation] = useState<string>('');
   const [compact, setCompact] = useState<boolean>(true);

   if ($storage.listings.length === 0) {
      return null;
   }

   if (compact) {
      return (
         <Button variant="outline"
            onClick={() => setCompact(false)}><MapPinHouse size={14} />
            {!$storage.location ? 'Startpunkt' : fromLocation}
         </Button>
      );
   }

   async function onLocationCheck() {
      if (fromLocation.length === 0) {
         return;
      }

      const result = await fetch(`/api/location?q=${encodeURIComponent(fromLocation)}`);

      if (!result.ok) {
         $storage.locationSet(null);
         toast.error("Fehler: Keine Koordinaten gefunden");
      } else {
         // $storage.locationSet(res);
         console.log(result);
         setCompact(true);
      }
   }

   return <div className="flex gap-1 items-center">
      <Input type="text"
         placeholder="Ort oder Adresse eingeben"
         value={fromLocation}
         onChange={(e) => {
            setFromLocation(e.target.value);
         }} />
      <Button variant="default"
         className="bg-primary text-white disabled:text-gray-700 disabled:bg-gray-300"
         disabled={fromLocation.length === 0}
         onClick={onLocationCheck}>
         <Search size={14} />
      </Button>
      <Button variant="outline" onClick={() => setCompact(true)}><CircleX size={14} /></Button>
   </div >;
};