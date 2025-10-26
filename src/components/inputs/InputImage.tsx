import { Input } from "../ui/input";
import { InputNext } from "./InputNext";

interface Props {
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}

export const InputImage = ({ value, onChange, onNext }: Props) => {
   const imageSrc = value || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/no-image.png`;

   return (
      <>
         <p>Gib hier die URL zum Bild der Immobilie an. Eine kleine Vorschau wird angezeigt, sofern der Link korrekt ist, </p>

         <div className="flex gap-2 items-center">
            <img src={imageSrc}
               className="w-24 h-24 rounded-full object-cover" />
            <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
         </div>
         <InputNext onClick={onNext} />
      </>
   );
}