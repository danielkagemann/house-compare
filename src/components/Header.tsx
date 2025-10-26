"use client";

import Image from 'next/image';
import { LocationInput } from './LocationInput';
import Link from 'next/link';
import { FilterPanel } from './FilterPanel';

export const Header = () => {

   // 292x72 = ratio 4.055
   const height = 50;
   return (
      <header className="w-full border-b-1 border-gray-300 bg-white p-4 flex items-center justify-between ">
         <Link href="/">
            <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/logo.png`} width={height * 4.055} height={height} alt="logo" />
         </Link>
         <div className="flex gap-1 items-center">
            <FilterPanel />
            <LocationInput />
         </div>
      </header>
   );
}