import { getRankTitle, Ranking, RankingType } from "@/model/Listing";

interface RankProps {
   value: RankingType;
}
export const Rank = ({ value }: RankProps) => {
   if (value === Ranking.none) {
      return null;
   }


   return (
      <div className="px-2 py-1 text-xs bg-black/90 text-white rounded-md">
         {getRankTitle(value)}
      </div>
   );
}  