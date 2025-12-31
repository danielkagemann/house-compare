import { InputNext } from "./InputNext";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getRankTitle, Ranking, RankingType } from "@/model/Listing";

interface Props {
   value: RankingType;
   onChange: (value: RankingType) => void;
   onNext: () => void;
}

export const InputRank = ({ value, onChange, onNext }: Props) => {

   return (
      <>
         <p className="pb-2">Wähle hier aus, wie Du die Immobilie bewertest.</p>
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
                     <Label htmlFor={key}>{getRankTitle(val)}</Label>
                  </div>);
               })
            }
         </RadioGroup >
         <InputNext onClick={onNext} />
      </>
   );
}