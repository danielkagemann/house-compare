import { useCoordinates } from "@/hooks/useCoordinates";
import { CircleX, MapPinHouse, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useStorage } from "@/hooks/storage-provider";
import { Input } from "./ui/input";

export const LocationInput = () => {
   // states
   const [fromLocation, setFromLocation] = useState<string>('');
   const [compact, setCompact] = useState<boolean>(true);

   // hooks
   const $coords = useCoordinates();
   const $storage = useStorage();

   if ($storage.listings.length === 0) {
      return null;
   }

   if (compact) {
      return (
         <Button variant="outline"
            onClick={() => setCompact(false)}><MapPinHouse size={14} />
            {!$storage.location ? 'Startpunkt setzen' : `Startpunkt: ${fromLocation} ändern`}
         </Button>
      );
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
         onClick={() => {
            if (fromLocation.length > 0) {
               $coords.fromAddress(fromLocation).then((res) => {
                  $storage.locationSet(res);
                  setCompact(true);
               }).catch(() => {
                  $storage.locationSet(null);
                  toast.error("Fehler: Keine Koordinaten gefunden");
               });
            }
         }}>
         <Search size={14} />
      </Button>
      <Button variant="outline" onClick={() => setCompact(true)}><CircleX size={14} /></Button>
   </div >;
};