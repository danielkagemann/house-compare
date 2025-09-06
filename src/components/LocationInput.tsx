import { useCoordinates } from "@/hooks/useCoordinates";
import { useToast } from "@/hooks/useToast";
import { Coordinates } from "@/model/Listing";
import { MapPinHouse } from "lucide-react";
import { useState } from "react";

type Props = {
   onChange: (coords: Coordinates) => void;
};

export const LocationInput = ({ onChange }: Props) => {
   // states
   const [fromLocation, setFromLocation] = useState<string>('');
   const [compact, setCompact] = useState<boolean>(true);
   const [coord, setCoord] = useState<Coordinates | null>(null);

   // hooks
   const $coords = useCoordinates();
   const { showToast } = useToast();

   if (compact) {
      return (
         <button type="button"
            className="text-primary text-md cursor-pointer flex gap-1 items-center"
            onClick={() => setCompact(false)}><MapPinHouse size={14} />
            {!coord ? 'Startpunkt setzen' : `Startpunkt: ${fromLocation} ändern`}
         </button>
      )
   }

   return <div className="flex gap-1 items-center">
      <input type="text" className="border border-gray-300 rounded-lg p-2 w-full"
         placeholder="Ort oder Adresse eingeben"
         value={fromLocation}
         onChange={(e) => {
            setFromLocation(e.target.value);
         }} />
      <button type="button"
         className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer disabled:text-gray-700 disabled:bg-gray-300"
         disabled={fromLocation.length === 0}
         onClick={() => {
            if (fromLocation.length > 0) {
               $coords.fromAddress(fromLocation).then((res) => {
                  setCoord(res);
                  setCompact(true);
                  onChange(res);
               }).catch(() => {
                  setCoord(null);
                  showToast('Fehler: Keine Koordinaten gefunden');
               });
            }
         }}>
         Suchen
      </button>
   </div>;
};