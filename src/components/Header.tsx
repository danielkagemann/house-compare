"use client";

import Image from 'next/image';
import { LocationInput } from './LocationInput';
import Link from 'next/link';
import { FilterPanel } from './FilterPanel';
import { About } from './About';

export const Header = () => {
   return (
      <header className="w-full bg-white p-4 flex items-center justify-between ">
         <Link href="/" className="flex gap-2 items-center">
            <Image src="/assets/images/main-logo.png" width={42} height={42} alt="logo" /> <div className="text-2xl font-bold">Villaya</div>
         </Link>
         <div className="flex gap-2 items-center">
            <About />
            <FilterPanel />
            <LocationInput />
         </div>
      </header>
   );
}