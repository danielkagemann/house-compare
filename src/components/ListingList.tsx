"use client";

import { motion } from "motion/react";
import { HouseCard } from "./HouseCard";
import { NoListings } from "./NoListings";
import { useStorage } from "@/store/storage";
import { useGetPropertyList } from "@/lib/fetch";
import { Listing } from "@/model/Listing";
import { Loading } from "./Loading";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Footer } from "./layout/Footer";
import { NavigationBar } from "./layout/NavigationBar";
import { LocationInput } from "./LocationInput";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
   ssr: false,
});


export const ListingList = () => {
   // hook
   const $storage = useStorage();
   const t = useTranslations("house");

   // queries
   const { data: listings, isLoading } = useGetPropertyList();

   if (isLoading) {
      return <Loading />
   }

   // render empty data
   if (listings.length === 0) {
      return <NoListings />;
   }

   function renderListings() {
      return (<div className="p-4 grid grid-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
         {
            listings.length === 0 && (
               <div className="col-span-full">
                  <p className="text-gray-500">{t('noListingsFound')}</p>
               </div>
            )
         }

         {
            listings.map((item: Listing, index: number) => (
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
                     onSelect={() => $storage.selectionToggle(item.uuid)} />
               </motion.div>
            ))
         }
      </div>
      );
   }

   return (
      <div className="h-screen grid grid-cols-[80px_1fr_1fr] overflow-hidden">
         {/* navigation */}
         <NavigationBar />

         {/* content */}
         <section className="overflow-y-auto">
            <div className="flex justify-between p-4">
               <h1 className="text-lg font-semibold">{t('availableListings')}</h1>
               <LocationInput />
            </div>
            {renderListings()}
            <Footer />
         </section>

         {/* map */}
         <aside className="bg-gray-100 overflow-hidden">
            <PropertiesMap listings={listings} />
         </aside>
      </div>
   );
};