import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";

interface Props {
   price: string;
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}

export const InputSize = ({ price, value, onChange, onNext }: Props) => {
   function getPrice() {
      const p = parseFloat(price);
      let res = 0;
      if (p > 0) {
         const v = parseFloat(value);
         if (v !== 0) {
            res = p / v;
         }
      }
      return res;
   }

   const quote = getPrice();

   return (
      <>
         <p>Gib hier die Wohnfläche oder Nutzfläche in m² an. Der Quadratmeterpreis wird automatisch berechnet.</p>
         <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
         {quote > 0 && <p>Der Preis pro Quadratmeter beträgt {Math.round(quote)} €.</p>}
         <InputNext onClick={onNext} />
      </>
   );
}