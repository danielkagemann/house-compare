import { Button } from "../ui/button";
import { useCoordinates } from "@/hooks/useCoordinates";
import { Coordinates } from "@/model/Listing";
import { MapPin } from "lucide-react";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";

interface Props {
   value: string;
   coords?: Coordinates;
   onChange: (value: string) => void;
   onCoords: (coords?: Coordinates) => void;
   onNext: () => void;
}

export const InputLocation = ({ value, onChange, coords, onCoords, onNext }: Props) => {

   // hooks
   const addr = useCoordinates();

   const onFindAddr = async () => {
      const result = await addr.fromAddress(value);
      onCoords(result);
   };

   return (
      <>
         <p>Bitte gib den Standort der Immobilie an. Es wird vesucht eine ungefähre Adresse zu finden. </p>
         <div className="flex gap-1">
            <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
            <Button variant="outline" onClick={onFindAddr}><MapPin size={16} /></Button>
         </div>
         <p className="text-sm">{coords ? `Gefundene Koordinaten: ${coords.lat}, ${coords.lon}` : "Keine gültige Adresse."}</p>
         <InputNext onClick={onNext} />
      </>
   );
};