"use client";

import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "../ui/Tooltip";
import { Button } from "../ui/button";
import { useGetShareLink } from '@/lib/fetch';
import { toast } from 'sonner';
import { Plus } from '../animate-ui/icons/plus';
import { Send } from '../animate-ui/icons/send';
import { List } from '../animate-ui/icons/list';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CompareButton } from "../CompareButton";

export const NavigationBar = () => {
   // hooks
   const t = useTranslations("header");
   const $router = useRouter();
   const $link = useGetShareLink();

   function onCopy() {
      if ($link?.data) {
         const fullLink = `https://villaya.de/shared/?from=${$link.data}`;
         navigator.clipboard.writeText(fullLink);
         toast.success(t("linkCopied"));
      }
   }

   // w-20 is 80px
   return (
      <nav className="bg-gray-600 text-white w-20 h-full flex flex-col items-center space-y-8 py-16">
         <Link href="/?init">
            <Image src="/assets/images/main-logo.webp" width={32} height={32} alt="logo" className="invert-100" />
         </Link>
         <Tooltip text={t("immo")} position="right">
            <Button variant="ghost" onClick={() => $router.push("/properties")}>
               <List animateOnHover size={18} />
            </Button>
         </Tooltip>
         <Tooltip text={t("addImmo")} position="right">
            <Button variant="ghost" onClick={() => $router.push("/properties/details")}>
               <Plus animateOnHover size={18} />
            </Button>
         </Tooltip>
         {$link &&
            <Tooltip text={t("shareList")} position="right">
               <Button variant="ghost" onClick={onCopy}>
                  <Send animateOnHover size={18} />
               </Button>
            </Tooltip>
         }
         <CompareButton />

      </nav >
   );
}

