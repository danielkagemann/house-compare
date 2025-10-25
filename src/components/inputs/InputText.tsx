import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
   description?: string;
   value: string;
   onChange: (value: string) => void;
   type?: 'text' | 'area';
   children?: React.ReactNode;
}

export const InputText = ({ description, value, onChange, children, type = 'text' }: Props) => {
   // state
   const [data, setData] = useState<string>(value);

   return (
      <>
         {description}
         {type === 'area' && (
            <textarea className="w-full p-1.5 border rounded-md" rows={3} value={data} onChange={(e) => setData(e.target.value)} />
         )}
         {type === 'text' && (
            <input type="text" className="w-full p-1.5 border rounded-md" value={data} onChange={(e) => setData(e.target.value)} />
         )}
         {children}
         <div className="flex justify-end">
            <Button onClick={() => onChange(data)}>Übernehmen</Button>
         </div>
      </>
   );
}