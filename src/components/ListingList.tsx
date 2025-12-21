"use client";

import { motion } from "motion/react";
import { HouseCard } from "./HouseCard";
import { PageLayout } from "./PageLayout";
import { Header } from "./Header";
import { NoListings } from "./NoListings";
import { useStorage } from "@/context/storage-provider";
import { useGetPropertyList } from "@/lib/fetch";
import { Listing } from "@/model/Listing";
import { Loading } from "./Loading";

export const ListingList = () => {
   // hook
   const $storage = useStorage();

   // queries
   const { data: listings, isLoading } = useGetPropertyList();

   if (isLoading) {
      return <Loading />
   }

   // render empty data
   if (listings.length === 0) {
      return <NoListings />;
   }

   const isFilteredOut = (data: Listing): boolean => {
      if ($storage.filter.maxPrice > 0 && Number.parseFloat(data.price) > $storage.filter.maxPrice) {
         return true;
      }
      if ($storage.filter.minArea > 0 && Number.parseFloat(data.sqm) < $storage.filter.minArea) {
         return true;
      }
      return false;
   }

   const getFilteredListings = (): Listing[] => {
      return $storage.filter.removeFromList ? listings.filter((item: Listing) => !isFilteredOut(item)) : listings;
   };

   const list = getFilteredListings();

   return (
      <PageLayout>
         <Header />
         <div className="p-4 grid grid-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {
               list.length === 0 && (
                  <div className="col-span-full">
                     <p className="text-gray-500">Keine Immobilien für diese Filterkriterien gefunden.</p>
                  </div>
               )
            }
            {
               list.map((item, index) => (
                  <motion.div
                     key={item.uuid}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                        duration: 0.3,
                        delay: index * 0.1
                     }}
                  >
                     <HouseCard
                        data={item}
                        isSelected={$storage.selectionContains(item.uuid)}
                        onSelect={() => $storage.selectionToggle(item.uuid)}
                        isMarked={isFilteredOut(item)} />
                  </motion.div>
               ))
            }
         </div>
      </PageLayout>
   );
};