import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { InputNext } from "./InputNext";

interface Props {
   description?: string;
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
   type?: 'text' | 'area';
}

export const InputText = ({ description, value, onChange, onNext, type = 'text' }: Props) => {
   return (
      <>
         {description}
         {type === 'area' && (
            <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
         )}
         {type === 'text' && (
            <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
         )}
         <InputNext onClick={onNext} />
      </>
   );
}