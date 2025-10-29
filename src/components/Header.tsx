"use client";

import Image from 'next/image';
import { LocationInput } from './LocationInput';
import Link from 'next/link';
import { FilterPanel } from './FilterPanel';
import { About } from './About';

export const Header = () => {
   return (
      <header className="w-full border-b-1 border-gray-300 bg-white p-4 flex items-center justify-between ">
         <Link href="/">
            <Image src="/assets/images/main-logo.png" width={50} height={50} alt="logo" /> Villaya
         </Link>
         <div className="flex gap-1 items-center">
            <About />
            <FilterPanel />
            <LocationInput />
         </div>
      </header>
   );
}