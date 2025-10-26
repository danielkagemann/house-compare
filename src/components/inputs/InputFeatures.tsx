import { Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { InputNext } from "./InputNext";

interface Props {
   value: string[],
   onChange: (value: string[]) => void;
   onNext: () => void;
}

export const InputFeatures = ({ value, onChange, onNext }: Props) => {
   // states
   const [feature, setFeature] = useState<string>('');
   const [flatList, setFlatList] = useState<string>('');

   function renderFeature(item: string, index: number) {
      return (
         <div className="flex gap-1">
            <Button variant="ghost" onClick={() => {
               const newValues = value.filter((_, i) => i !== index);
               onChange(newValues);
            }}><Trash size={14} className="text-red-700" /></Button>
            <Input type="text" value={item} onChange={(e) => {
               const ls = [...value];
               ls[index] = e.target.value;
               onChange(ls);
            }} />
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
               const newValues = [...value, ...featuresFromList];
               onChange(newValues);
               setFlatList('');
            }}>...in Liste</Button>
         </div>

         <strong>Alle Merkmale der Immobilie</strong>

         <div className="flex flex-col gap-1">
            {
               value.map(renderFeature)
            }
         </div>
         <div className="flex gap-1">
            <Input type="text" value={feature} onChange={(e) => setFeature(e.target.value)} />
            <Button variant="outline" disabled={feature.trim().length === 0} onClick={() => {

               const newValues = [...value, feature];
               onChange(newValues);
               setFeature('');
            }}>Hinzufügen</Button>
         </div>
         <InputNext onClick={onNext} />
      </>
   );
}