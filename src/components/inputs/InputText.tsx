import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
            <Textarea rows={3} value={data} onChange={(e) => setData(e.target.value)} />
         )}
         {type === 'text' && (
            <Input type="text" value={data} onChange={(e) => setData(e.target.value)} />
         )}
         {children}
         <div className="flex justify-end">
            <Button onClick={() => onChange(data)}>Übernehmen</Button>
         </div>
      </>
   );
}