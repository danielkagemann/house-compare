"use client";

import { useGetSharedPropertyList } from "@/lib/fetch";
import { Listing } from "@/model/Listing";
import { useSearchParams } from "next/navigation";
import { PageLayout } from "./PageLayout";
import { Hero } from "./Hero";
import Image from "next/image";
import { HouseListItem } from "./HouseListItem";
import { Loading } from "./Loading";
import { Fragment, use, useEffect, useMemo, useState } from "react";
import { RenderIf } from "./renderif";
import { FloatingAction, FloatingActionType } from "./layout/FloatingAction";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
   ssr: false,
});

export const ListingShare = () => {
   // state
   const [from, setFrom] = useState<string | null>(null);
   const [hidden, setHidden] = useState<string[]>([]);
   const [display, setDisplay] = useState<FloatingActionType>('list');

   // hooks
   const $url = useSearchParams();
   const t = useTranslations("house");

   // queries
   const { data: listing, isLoading } = useGetSharedPropertyList(from);

   useEffect(() => {
      setFrom($url.get('from'));
      setHidden($url.get('hide')?.split(',') || []);
   }, [$url]);

   // derived state
   const visibleItems = useMemo(() => (listing ?? []).filter((item: Listing, index: number) => !hidden.includes(index.toString())), [listing, hidden]);

   if (isLoading || !listing) {
      return (<Loading />);
   }

   if (listing?.length === 0) {
      return (<PageLayout className="pt-12">
         <Hero>
            <div className="text-red-700 font-bold">
               {t('noListingsFound')}
            </div>
         </Hero>
      </PageLayout>);
   }

   return (<PageLayout>
      <div className="flex flex-col gap-2">
         <Image src="/assets/images/main-logo.webp" width={42} height={42} alt="logo" /> <div className="text-2xl font-bold">Villaya</div>

         <RenderIf condition={display === 'list'}>
            {
               visibleItems.map((item: Listing) => (
                  <Fragment key={item.uuid}>
                     <HouseListItem item={item} />
                     <div className="md:hidden pt-2 mb-4 border-b-8 border-gray-200 w-[calc(100%+2rem)] -mx-4" />
                  </Fragment>
               ))
            }
         </RenderIf>

         <RenderIf condition={display === 'map'}>
            <div className="w-full h-[calc(100vh-10rem)]">
               <PropertiesMap listings={visibleItems} />
            </div>
         </RenderIf>
         <FloatingAction selected={display} onChange={setDisplay} />
      </div>
   </PageLayout >);
}