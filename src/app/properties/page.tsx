"use client";

import { HouseCard } from "@/components/HouseCard";
import { motion } from "motion/react";
import { Listing } from "@/model/Listing";
import { useEffect, useState } from "react";
import { useStorage } from "@/context/storage-provider";
import { fetchProperties } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/Hero";

export default function Home() {
  // hook
  const $storage = useStorage();
  const $router = useRouter();

  // state
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if ($storage.user && $storage.user.access) {
      fetchProperties($storage.user.access).then((data) => {
        setListings(data);
      });
    }

  }, [$storage.user]);

  // render empty data
  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 space-y-12">
        <Hero>
          <div className="flex flex-col gap-2">
            <p>Du hast bisher noch keine Traumhäuser gespeichert. Suche nach Deinem persönlichen Traumhaus und speichere die Informationen hier.</p>
            <div className="font-bold text-sm">Du hast eine Immobilie gefunden? Dann schnell eintragen</div>
            <Button onClick={() => $router.push("/properties/details")}>Immobilie hinzufügen</Button>
          </div>
        </Hero>
      </div>
    );
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

  return (
    <>
      <div className="p-4 grid grid-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {
          getFilteredListings().map((item, index) => (
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
    </>
  );
};

