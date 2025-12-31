"use client";

import { Ranking, RankingType } from "@/model/Listing";
import { useTranslations } from "next-intl";

interface RankProps {
   value: RankingType;
}
export const Rank = ({ value }: RankProps) => {
   // hooks
   const t = useTranslations("rank");

   if (value === Ranking.none) {
      return null;
   }


   return (
      <div className="px-2 py-1 text-xs bg-black/90 text-white rounded-md">
         {t(value.toString())}
      </div>
   );
}  