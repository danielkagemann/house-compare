import { getSquareMeterPrice } from "@/model/Listing";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";
import { use } from "react";
import { useTranslations } from "next-intl";

interface Props {
   price: string;
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}

export const InputSize = ({ price, value, onChange, onNext }: Props) => {

   const quote = getSquareMeterPrice(price, value);
   const t = useTranslations("input");

   return (
      <>
         <p>{t("sizeDescription")}</p>
         <Input type="text" autoFocus value={value} onChange={(e) => onChange(e.target.value)} />
         {quote !== '---' && <p>{t("priceSqm", { price: quote })}</p>}
         <InputNext onClick={onNext} />
      </>
   );
}