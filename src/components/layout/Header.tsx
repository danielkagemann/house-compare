"use client";

import Image from 'next/image';
import { LocationInput } from '../LocationInput';
import Link from 'next/link';
import { Button } from '../ui/button';

import { useRouter } from 'next/navigation';
import { CompareButton } from '../CompareButton';
import { Tooltip } from '../ui/Tooltip';
import { useGetShareLink } from '@/lib/fetch';
import { toast } from 'sonner';
import { Plus } from '../animate-ui/icons/plus';
import { Send } from '../animate-ui/icons/send';
import { List } from '../animate-ui/icons/list';
import { useTranslations } from 'next-intl';

export const Header = () => {
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

   return (
      <header className="w-full bg-white p-4 flex flex-col md:flex-row md:items-center justify-between ">
         <Link href="/?init" className="flex gap-2 items-center">
            <Image src="/assets/images/main-logo.webp" width={42} height={42} alt="logo" /> <div className="text-2xl font-bold">Villaya</div>
         </Link>
         <div className="flex gap-1 md:gap-2 items-center">
            <Tooltip text={t("immo")}>
               <Button variant="secondary" onClick={() => $router.push("/properties")}>
                  <List animateOnHover size={18} />
               </Button>
            </Tooltip>
            <Tooltip text={t("addImmo")}>
               <Button variant="secondary" onClick={() => $router.push("/properties/details")}>
                  <Plus animateOnHover size={18} />
               </Button>
            </Tooltip>
            {$link &&
               <Tooltip text={t("shareList")}>
                  <Button variant="secondary" onClick={onCopy}>
                     <Send animateOnHover size={18} />
                  </Button>
               </Tooltip>
            }
            <CompareButton />
            <LocationInput />
         </div>
      </header>
   );
}