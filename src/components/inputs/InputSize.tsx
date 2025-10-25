import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
   price: string;
   value: string;
   onChange: (value: string, sqmPrice: string) => void;
}

export const InputSize = ({ price, value, onChange }: Props) => {
   // state
   const [data, setData] = useState<string>(value);

   function getPrice() {
      const p = parseFloat(price);
      let res = 0;
      if (p > 0) {
         const v = parseFloat(data);
         if (v !== 0) {
            res = p / v;
         }
      }
      return res;
   }

   return (
      <>
         <p>Gib hier die Wohnfläche oder Nutzfläche in m² an. Der Quadratmeterpreis wird automatisch berechnet.</p>
         <Input type="text" value={data} onChange={(e) => setData(e.target.value)} />
         <p>Der Preis pro Quadratmeter beträgt {getPrice()} €.</p>
         <div className="flex justify-end">
            <Button onClick={() => onChange(data, getPrice().toString())}>Übernehmen</Button>
         </div>
      </>
   );
}