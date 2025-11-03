"use client";

import { useGetSharedPropertyList } from "@/lib/fetch";
import { Listing } from "@/model/Listing";
import { useSearchParams } from "next/navigation";
import { PageLayout } from "./PageLayout";
import { Hero } from "./Hero";
import Image from "next/image";
import { HouseListItem } from "./HouseListItem";
import { Loading } from "./Loading";

export const ListingShare = () => {
   // hooks
   const $url = useSearchParams();

   // queries 
   const { data: listing, isLoading } = useGetSharedPropertyList($url.get('from') || '');

   if (isLoading) {
      return (<Loading />);
   }

   if (listing.length === 0) {
      return (<PageLayout className="pt-12">
         <Hero>
            <div className="text-red-700 font-bold">
               Es sind keine Immobilien vorhanden.
            </div>
         </Hero>
      </PageLayout>);
   }
   return (<PageLayout>
      <div className="flex flex-col gap-2">
         <Image src="/assets/images/main-logo.png" width={42} height={42} alt="logo" /> <div className="text-2xl font-bold">Villaya</div>
         {listing.map((item: Listing) => (<HouseListItem key={item.uuid} item={item} />))}
      </div>
   </PageLayout>);
}