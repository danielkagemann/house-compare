"use client";

import Image from 'next/image';
import { LocationInput } from './LocationInput';
import Link from 'next/link';
import { FilterPanel } from './FilterPanel';
import { Button } from './ui/button';
import { Plus, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CompareButton } from './CompareButton';
import { Tooltip } from './ui/Tooltip';
import { useEffect, useState } from 'react';
import { Endpoints } from '@/lib/fetch';
import { useStorage } from '@/context/storage-provider';
import { toast } from 'sonner';

export const Header = () => {
   // state
   const [link, setLink] = useState<string>("");

   // hooks
   const $router = useRouter();
   const $save = useStorage();

   useEffect(() => {
      Endpoints.authShare($save.token || '').then((data) => {
         if (data) {
            setLink(data);
         }
      });
   }, [$save.token]);

   function onCopy() {
      if (link.length > 0) {
         const fullLink = `https://villaya.de/shared/?from=${link}`;
         navigator.clipboard.writeText(fullLink);
         toast.success("Link in die Zwischenablage kopiert!");
      }
   }

   return (
      <header className="w-full bg-white p-4 flex items-center justify-between ">
         <Link href="/" className="flex gap-2 items-center">
            <Image src="/assets/images/main-logo.png" width={42} height={42} alt="logo" /> <div className="text-2xl font-bold">Villaya</div>
         </Link>
         <div className="flex gap-2 items-center">
            <Tooltip text="Immobilie hinzufügen">
               <Button variant="outline" onClick={() => $router.push("/properties/details")}><Plus size={18} /></Button>
            </Tooltip>
            {link.length > 0 &&
               <Tooltip text="Mit Freunden teilen">
                  <Button variant="outline" onClick={onCopy}><Share size={18} /></Button>
               </Tooltip>
            }
            <FilterPanel />
            <CompareButton />
            <LocationInput />
         </div>
      </header>
   );
}