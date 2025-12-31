import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";
import { useTranslations } from "next-intl";

interface InputLinkProps {
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}
export const InputLink = ({ value, onChange, onNext }: InputLinkProps) => {
   const t = useTranslations("input");

   function onOpen(e: React.FormEvent) {
      e.preventDefault();
      window.open(value, '_blank');
   }

   return (
      <>
         {t("pleaseEnterPropertyUrl")}
         <div className="flex gap-1">
            <Input
               autoFocus
               type="text"
               placeholder={t("enterPropertyUrl")}
               value={value}
               onChange={(e) => onChange(e.target.value)} />
            <Button variant="outline" onClick={onOpen}><ExternalLink size={16} /></Button>
         </div>
         <InputNext onClick={onNext} />
      </>
   );
};
