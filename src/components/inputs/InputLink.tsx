import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";

interface InputLinkProps {
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}
export const InputLink = ({ value, onChange, onNext }: InputLinkProps) => {
   function onOpen(e: React.FormEvent) {
      e.preventDefault();
      window.open(value, '_blank');
   }

   return (
      <>
         Hier kannst Du die URL der Immobilie eingeben.
         <div className="flex gap-1">
            <Input
               autoFocus
               type="text"
               placeholder="URL der Immobilie eingeben..."
               value={value}
               onChange={(e) => onChange(e.target.value)} />
            <Button variant="outline" onClick={onOpen}><ExternalLink size={16} /></Button>
         </div>
         <InputNext onClick={onNext} />
      </>
   );
};
