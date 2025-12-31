import { InputNext } from "./InputNext";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Ranking, RankingType } from "@/model/Listing";
import { useTranslations } from "next-intl";

interface Props {
   value: RankingType;
   onChange: (value: RankingType) => void;
   onNext: () => void;
}

export const InputRank = ({ value, onChange, onNext }: Props) => {
   const t = useTranslations();

   return (
      <>
         <p className="pb-2">{t("input.rankDescription")}</p>
         <RadioGroup
            orientation="horizontal"
            defaultValue="option-0"
            onValueChange={(val) => {
               const rankingValue = Number.parseInt(val.replace('option-', ''), 10) as RankingType;
               onChange(rankingValue);
            }} value={`option-${value}`}>
            {
               Object.values(Ranking).map((val) => {
                  const key = `option-${val}`;
                  return (<div className="flex items-center space-x-2" key={key}>
                     <RadioGroupItem value={key} id={key} />
                     <Label htmlFor={key}>{t(`rank.${val}`)}</Label>
                  </div>);
               })
            }
         </RadioGroup >
         <InputNext onClick={onNext} />
      </>
   );
}