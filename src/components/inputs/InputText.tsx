import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
   description: string;
   value: string;
   onChange: (value: string) => void;
   children?: React.ReactNode;
}

export const InputText = ({ description, value, onChange, children }: Props) => {
   // state
   const [data, setData] = useState<string>(value);

   return (
      <>
         {description}
         <input type="text" className="w-full p-1.5 border rounded-md" value={data} onChange={(e) => setData(e.target.value)} />
         {children}
         <div className="flex justify-end">
            <Button onClick={() => onChange(data)}>Weiter</Button>
         </div>
      </>
   );
}