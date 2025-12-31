import Link from "next/link";
import { Hero } from "./Hero";
import { PageLayout } from "./PageLayout";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export const NoListings = () => {
   // hooks
   const t = useTranslations("common");
   
   return (
      <PageLayout className="min-h-screen items-center justify-center">
         <Hero>
            <div className="flex flex-col gap-2">
               <p>{t("noListingsMessage")}</p>
               <div className="font-bold text-sm">{t("foundAPropertyPrompt")}</div>
               <Link href="/properties/details">
                  <Button>{t("addProperty")}</Button>
               </Link>
            </div>
         </Hero>
      </PageLayout>
   );
};