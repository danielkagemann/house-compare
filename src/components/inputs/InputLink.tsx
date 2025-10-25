import { useState } from "react";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

interface InputLinkProps {
   value: string;
   onChange: (value: string) => void;
}
export const InputLink = ({ value, onChange }: InputLinkProps) => {
   const [data, setData] = useState<string>(value);

   function onOpen(e: React.FormEvent) {
      e.preventDefault();
      window.open(data, '_blank');
   }

   return (
      <>
         Hier kannst Du die URL der Immobilie eingeben.
         <div className="flex gap-1">
            <input type="text" className="w-full p-1.5 border rounded-md" placeholder="URL der Immobilie eingeben..." value={data} onChange={(e) => setData(e.target.value)} />
            <Button variant="outline" onClick={onOpen}><ExternalLink size={16} /></Button>
         </div>
         <div className="flex justify-end"><Button onClick={() => onChange(data)}>Übernehmen</Button></div>
      </>
   );
};
