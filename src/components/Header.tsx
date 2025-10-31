"use client";

import Image from 'next/image';
import { LocationInput } from './LocationInput';
import Link from 'next/link';
import { FilterPanel } from './FilterPanel';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Header = () => {
   // hooks
   const $router = useRouter();

   return (
      <header className="w-full bg-white p-4 flex items-center justify-between ">
         <Link href="/" className="flex gap-2 items-center">
            <Image src="/assets/images/main-logo.png" width={42} height={42} alt="logo" /> <div className="text-2xl font-bold">Villaya</div>
         </Link>
         <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={() => $router.push("/properties/details")}><Plus size={18} /></Button>
            <FilterPanel />
            <LocationInput />
         </div>
      </header>
   );
}