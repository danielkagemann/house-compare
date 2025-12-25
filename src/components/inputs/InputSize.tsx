import { getSquareMeterPrice } from "@/model/Listing";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";

interface Props {
   price: string;
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}

export const InputSize = ({ price, value, onChange, onNext }: Props) => {

   const quote = getSquareMeterPrice(price, value);

   return (
      <>
         <p>Gib hier die Wohnfläche oder Nutzfläche in m² an. Der Quadratmeterpreis wird automatisch berechnet.</p>
         <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
         {quote !== '---' && <p>Der Preis pro Quadratmeter beträgt {quote} EUR.</p>}
         <InputNext onClick={onNext} />
      </>
   );
}