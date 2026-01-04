import Link from "next/link";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { Main } from "./layout/Main";

export const NoListings = () => {
   // hooks
   const t = useTranslations("common");

   return (
      <Main>
         <div className="flex flex-col gap-2">
            <p>{t("noListingsFound")}</p>
            <div className="font-bold text-sm">{t("foundAPropertyPrompt")}</div>
            <Link href="/properties/details">
               <Button>{t("addProperty")}</Button>
            </Link>
         </div>
         <div></div>
      </Main>
   );
};