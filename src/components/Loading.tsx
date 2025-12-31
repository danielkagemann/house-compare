"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export const Loading = () => {
   // hooks
   const t = useTranslations("common");

   return (
      <div className="flex justify-center items-center w-full h-screen gap-2">
         <Image src="/assets/images/main-logo.webp" width={40} height={40} alt="logo" />
         <div className="flex flex-col gap-0">
            <div className="text-lg font-bold">Villaya</div>
            <div className="text-xs -mt-1">{t('loading')}</div>
         </div>
      </div>);
}
   ;