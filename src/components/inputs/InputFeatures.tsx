import { Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Props {
   value: string[],
   onChange: (value: string[]) => void;
}

export const InputFeatures = ({ value, onChange }: Props) => {
   // states
   const [data, setData] = useState<string[]>(value);
   const [feature, setFeature] = useState<string>('');
   const [flatList, setFlatList] = useState<string>('');

   function renderFeature(item: string, index: number) {
      return (
         <div className="flex gap-1">
            <Button variant="ghost" onClick={() => setData(prev => prev.filter((_, i) => i !== index))}><Trash size={14} className="text-red-700" /></Button>
            <Input type="text" value={item} onChange={(e) => setData(prev => {
               const ls = [...prev];
               ls[index] = e.target.value;
               return ls;
            })} />
         </div>
      );
   }

   return (
      <>
         <p>Bitte gib die Ausstattungsmerkmale der Immobilie an. Nutzer hierzu das Eingabefeld (komma getrennt) oder die Liste darunter.</p>
         <Textarea rows={3} placeholder="z.B. Balkon, Garten, Garage" value={flatList} onChange={(e) => setFlatList(e.target.value)} />
         <div className="flex justify-end">
            <Button variant="outline" disabled={flatList.trim().length === 0} onClick={() => {
               const featuresFromList = flatList.split(',').map(f => f.trim()).filter(f => f.length > 0);
               setData(prev => [...prev, ...featuresFromList]);
               setFlatList('');
            }}>...in Liste</Button>
         </div>
         <p>oder nutze die Liste</p>
         <div className="flex flex-col gap-1">
            {
               data.map(renderFeature)
            }
         </div>
         <div className="flex gap-1">
            <Input type="text" value={feature} onChange={(e) => setFeature(e.target.value)} />
            <Button variant="outline" disabled={feature.trim().length === 0} onClick={() => {
               setData(prev => [...prev, feature]);
               setFeature('');
            }}>Hinzufügen</Button>
         </div>
         <div className="flex justify-end"><Button onClick={() => onChange(data)}>Übernehmen</Button></div>
      </>
   );
}