import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { InputNext } from "./InputNext";
import { Trash } from "../animate-ui/icons/trash";
import { useTranslations } from "next-intl";

interface Props {
   value: string[],
   onChange: (value: string[]) => void;
   onNext: () => void;
}

export const InputFeatures = ({ value, onChange, onNext }: Props) => {
   // states
   const [feature, setFeature] = useState<string>('');
   const [flatList, setFlatList] = useState<string>('');

   // hooks
   const t = useTranslations("input");

   function renderFeature(item: string, index: number) {
      return (
         <div className="flex gap-1">
            <Button variant="ghost" onClick={() => {
               const newValues = value.filter((_, i) => i !== index);
               onChange(newValues);
            }}><Trash animateOnTap size={14} className="text-red-700" /></Button>
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
         <p>{t("pleaseEnterFeatures")}</p>
         <Textarea autoFocus rows={3} placeholder={t("examplePlaceholder")} value={flatList} onChange={(e) => setFlatList(e.target.value)} />
         <div className="flex justify-end">
            <Button variant="outline" disabled={flatList.trim().length === 0} onClick={() => {
               const featuresFromList = flatList.split(/[\n,]/).map(f => f.trim()).filter(f => f.length > 0);
               const newValues = [...value, ...featuresFromList];
               onChange(newValues);
               setFlatList('');
            }}>{t("addFromList")}</Button>
         </div>

         <strong>{t("allFeatures")}</strong>

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
            }}>{t("addProperty")}</Button>
         </div>
         <InputNext onClick={onNext} />
      </>
   );
}