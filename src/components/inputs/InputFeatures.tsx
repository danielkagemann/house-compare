import { Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
   value: string[],
   onChange: (value: string[]) => void;
}

export const InputFeatures = ({ value, onChange }: Props) => {
   // states
   const [data, setData] = useState<string[]>(value);
   const [feature, setFeature] = useState<string>('');

   function renderFeature(item: string, index: number) {
      return (
         <div className="flex gap-1">
            <Button variant="ghost" onClick={() => setData(prev => prev.filter((_, i) => i !== index))}><Trash size={14} className="text-red-700" /></Button>
            <input type="text" className="w-full p-1.5 border rounded-md" value={item} onChange={(e) => setData(prev => {
               const ls = [...prev];
               ls[index] = e.target.value;
               return ls;
            })} />
         </div>
      );
   }

   return (
      <>
         <p>Bitte gib die Ausstattungsmerkmale der Immobilie an.</p>
         <div className="flex flex-col gap-1">
            {
               data.map(renderFeature)
            }

         </div>
         <div className="flex gap-1">
            <input type="text" className="w-full p-1.5 border rounded-md" value={feature} onChange={(e) => setFeature(e.target.value)} />
            <Button variant="outline" disabled={feature.trim().length === 0} onClick={() => {
               setData(prev => [...prev, feature]);
               setFeature('');
            }}>Hinzufügen</Button>
         </div>
         <div className="flex justify-end"><Button onClick={() => onChange(data)}>Weiter</Button></div>
      </>
   );
}