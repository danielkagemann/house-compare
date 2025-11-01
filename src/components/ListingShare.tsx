"use client";

import { Endpoints } from "@/lib/fetch";
import { Listing } from "@/model/Listing";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageLayout } from "./PageLayout";
import { Hero } from "./Hero";
import Image from "next/image";
import { HouseListItem } from "./HouseListItem";

export const ListingShare = () => {
   // hooks
   const $url = useSearchParams();

   // states
   const [listing, setListing] = useState<Listing[]>([]);

   useEffect(() => {
      const share = $url.get('from');

      if (share) {
         Endpoints.propertyShareList(share).then((data) => {
            setListing(data);
         });
      }
   }, [$url]);

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
         {listing.map((item) => (<HouseListItem key={item.uuid} item={item} />))}
      </div>
   </PageLayout>);
}