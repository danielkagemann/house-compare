"use client";

import { motion } from "motion/react";
import { HouseCard } from "./HouseCard";
import { PageLayout } from "./PageLayout";
import { Header } from "./layout/Header";
import { NoListings } from "./NoListings";
import { useStorage } from "@/store/storage";
import { useGetPropertyList } from "@/lib/fetch";
import { Listing } from "@/model/Listing";
import { Loading } from "./Loading";
import { useState } from "react";
import { FloatingAction, FloatingActionType } from "./layout/FloatingAction";
import dynamic from "next/dynamic";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
   ssr: false,
});


export const ListingList = () => {
   // hook
   const $storage = useStorage();

   // state
   const [display, setDisplay] = useState<FloatingActionType>('list');

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
      if (display === 'map') {
         return null;
      }
      return (<div className="p-4 grid grid-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
         {
            listings.length === 0 && (
               <div className="col-span-full">
                  <p className="text-gray-500">Keine Immobilien für diese Filterkriterien gefunden.</p>
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

   function renderMap() {
      if (display === 'list') {
         return null;
      }
      return (
         <PropertiesMap listings={listings} />
      );
   }

   return (
      <PageLayout>
         <Header />
         {renderListings()}
         {renderMap()}
         <FloatingAction selected={display} onChange={setDisplay} />
      </PageLayout>
   );
};