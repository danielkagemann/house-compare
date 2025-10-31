"use client";

import { HouseCard } from "@/components/HouseCard";
import { motion } from "motion/react";
import { Listing } from "@/model/Listing";
import { useEffect, useState } from "react";
import { useStorage } from "@/context/storage-provider";
import { Endpoints } from "@/lib/fetch";
import { Header } from "@/components/Header";
import { NoListings } from "@/components/NoListings";
import { PageLayout } from "@/components/PageLayout";

export default function Home() {
  // hook
  const $storage = useStorage();

  // state
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if ($storage.token && $storage.token.length > 0) {
      Endpoints.propertyList($storage.token).then((data) => {
        setListings(data);
      });
    }

  }, [$storage.token]);

  // render empty data
  if (listings.length === 0) {
    return <NoListings />;
  }

  const isFilteredOut = (data: Listing): boolean => {
    if ($storage.filter.maxPrice > 0 && parseFloat(data.price) > $storage.filter.maxPrice) {
      return true;
    }
    if ($storage.filter.minArea > 0 && Number(data.sqm) < $storage.filter.minArea) {
      return true;
    }
    return false;
  }

  const getFilteredListings = (): Listing[] => {
    return $storage.filter.removeFromList ? listings.filter(item => !isFilteredOut(item)) : listings;
  };

  const list = getFilteredListings();

  return (
    <PageLayout>
      <Header />
      <div className="p-4 grid grid-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

