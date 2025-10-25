import { useState } from "react";
import { Button } from "../ui/button";
import { useCoordinates } from "@/hooks/useCoordinates";
import { Coordinates } from "@/model/Listing";
import { MapPin } from "lucide-react";
import { Input } from "../ui/input";

interface Props {
   value: string;
   onChange: (value: string, coords: Coordinates | null) => void;
}

export const InputLocation = ({ value, onChange }: Props) => {
   // state
   const [data, setData] = useState<string>(value);
   const [coords, setCoords] = useState<Coordinates | null>(null);

   // hooks
   const addr = useCoordinates();

   const onFindAddr = async () => {
      const result = await addr.fromAddress(data);
      setCoords(result);
   };

   return (
      <>
         <p>Bitte gib den Standort der Immobilie an. Es wird vesucht eine ungefähre Adresse zu finden. </p>
         <div className="flex gap-1">
            <Input type="text" value={data} onChange={(e) => setData(e.target.value)} />
            <Button variant="outline" onClick={onFindAddr}><MapPin size={16} /></Button>
         </div>
         <p className="text-sm">{coords ? `Gefundene Koordinaten: ${coords.lat}, ${coords.lon}` : "Keine gültige Adresse."}</p>
         <div className="flex justify-end"><Button onClick={() => onChange(data, coords)}>Übernehmen</Button></div>
      </>
   );
};