import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
   value: string;
   onChange: (value: string) => void;
}

export const InputImage = ({ value, onChange }: Props) => {
   // state
   const [data, setData] = useState<string>(value);

   const imageSrc = data || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/no-image.png`;

   return (
      <>
         <p>Gib hier die URL zum Bild der Immmobilie an. Eine kleine Vorschau wird angezeigt, sofern der Link korrekt ist, </p>

         <div className="flex gap-2 items-center">
            <img src={imageSrc}
               className="w-24 h-24 rounded-full object-cover" />
            <Input type="text" value={data} onChange={(e) => setData(e.target.value)} />
         </div>

         <div className="flex justify-end"><Button onClick={() => onChange(data)}>Übernehmen</Button></div>
      </>
   );
}