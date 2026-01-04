"use client";

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function NotFound() {
   // hooks
   const t = useTranslations('notfound');

   return (
      <div className="min-h-screen w-full text-white relative">
         <div className="absolute top-0 left-0 w-full h-screen bg-cover bg-center z-0 brightness-50" style={{ backgroundImage: "url('/assets/images/404.webp')" }} />
         <div className="p-8 space-y-4 flex flex-col justify-center items-center relative z-20 w-full h-screen text-center">
            <h2 className="text-4xl">{t('title')}</h2>
            <p>{t('subtitle')}</p>
            <Link href="/" className="font-bold underline hover:line-through">{t('goHome')}</Link>
         </div>
      </div>

   )
}
