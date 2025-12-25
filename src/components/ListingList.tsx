"use client";

import { motion } from "motion/react";
import { HouseCard } from "./HouseCard";
import { PageLayout } from "./PageLayout";
import { Header } from "./Header";
import { NoListings } from "./NoListings";
import { useStorage } from "@/store/storage";
import { useGetPropertyList } from "@/lib/fetch";
import { calculateScores, Listing } from "@/model/Listing";
import { Loading } from "./Loading";
import { useMemo } from "react";
import { Star } from "./animate-ui/icons/star";

const factors = {
   price: 0.25,
   sqm: 0.3,
   year: 0.2,
   rooms: 0.25,
};

export const ListingList = () => {
   // hook
   const $storage = useStorage();

   // queries
   const { data: properties, isLoading } = useGetPropertyList();

   // derived state
   const listings = useMemo(() => calculateScores(properties || [], factors), [properties]);

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
         <div className="bg-gray-50 rounded-lg p-4 mx-4 mb-2 text-xs/tight">
            <Star animateOnView loop size={16} loopDelay={2000} className="inline-block mr-1" animation="fill" />
            Für jede Immobilie wird automatisch ein Score basierend auf Preis ({factors.price}), Größe ({factors.sqm}), Baujahr ({factors.year}) und Zimmeranzahl ({factors.rooms}) berechnet. Je höher der Score, desto besser die Immobilie im Vergleich zu den anderen.
         </div>
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