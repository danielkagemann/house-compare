"use client";

import { distanceBetweenCoordinates, getSquareMeterPrice, Listing } from "@/model/Listing"
import { ListingPreview } from "./ListingPreview";
import { Sheet, SheetContent } from "./ui/sheet";
import { useState } from "react";
import { useStorage } from "@/store/storage";
import { motion } from "motion/react";
import { useDeleteProperty } from "@/lib/fetch";
import { Trash } from "./animate-ui/icons/trash";
import { List } from "./animate-ui/icons/list";
import { MapPin } from "./animate-ui/icons/map-pin";
import { BedDouble, Heart, Calendar, Car, Ruler } from "lucide-react";
import { Link2 } from "./animate-ui/icons/link-2";
import Link from "next/link";
import { RenderIf } from "./renderif";

interface HouseCardProps {
   data: Listing;
   isSelected: boolean;
   onSelect?: () => void;
}

export const HouseCard = ({ data, isSelected, onSelect }: HouseCardProps) => {
   // state
   const [show, setShow] = useState<boolean>(false);

   // hooks
   const $save = useStorage();

   // queries
   const $delete = useDeleteProperty();

   // derived state for distance calculation
   const distance = $save.location && data.location ? distanceBetweenCoordinates($save.location, { lat: data.location.lat, lon: data.location.lon }) : null;

   /**
    * delete the property
    */
   function onDelete() {
      $delete.mutateAsync(data.uuid);
   }

   return (
      <>
         <div className="bg-white md:shadow-lg md:rounded-lg md:p-3">
            {/* image */}
            <div className="w-full h-40 overflow-y-clip relative transition-all duration-300 mb-2 group">
               <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-full object-cover rounded-md"
               />

               {/* heart icon */}
               <motion.button
                  type="button"
                  className={`absolute top-2 left-2 ${isSelected ? 'bg-red-700' : 'bg-black'} bg-opacity-75 rounded-lg p-2`}
                  onClick={onSelect}
                  whileHover={{
                     scale: [1, 1.2, 1]
                  }}
                  whileTap={{ y: -5 }}
                  transition={{
                     duration: 0.3,
                     scale: { repeat: 1, duration: 0.5 }
                  }}
               >
                  <Heart size={14} className="text-white" />
               </motion.button>

               {/* delete */}
               <motion.button
                  type="button"
                  className="absolute bottom-2 left-2 bg-black/10 transition-all duration-200 rounded-lg p-2 group-hover:bg-black"
                  onClick={onDelete}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
               >
                  <Trash animateOnHover size={14} className="text-white" />
               </motion.button>

               {/* original website */}
               <motion.div
                  className={`absolute bottom-2 right-10 bg-black/10 transition-all duration-200 rounded-lg p-2 group-hover:bg-black`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ y: -5 }}
                  transition={{ duration: 0.2 }}>

                  <Link href={data.url} target="_blank" rel="noopener noreferrer">
                     <Link2 animateOnHover size={14} className="text-white" /></Link>
               </motion.div>

               {/* edit */}
               <motion.button
                  type="button"
                  className={`absolute bottom-2 right-2 bg-black/10 transition-all duration-200 rounded-lg p-2 group-hover:bg-black`}
                  onClick={() => setShow(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ y: -5 }}
                  transition={{ duration: 0.2 }}
               >
                  <List animateOnHover size={14} className="text-white" />
               </motion.button>

            </div>

            {/* price */}
            <div className="flex justify-between gap-1 items-center">
               <div className="text-lg font-semibold">
                  EUR {Number.parseFloat(data.price || '0').toLocaleString()}
               </div>
               <div className="text-xs text-gray-500">{getSquareMeterPrice(data.price, data.sqm, true)} pro m²</div>
            </div>

            {/* title and location */}
            <div className="mb-2">
               <h2>{data.title}</h2>
               <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin animateOnHover size={14} /> <span className="truncate">{data.location.display} {data.location.country} </span>
               </div>
               <RenderIf condition={distance !== null}>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                     <Car size={12} /> {distance?.toFixed(1)} km entfernt
                  </div>
               </RenderIf>
            </div>

            {/* details like rooms, sqm, build */}
            <div className="flex gap-1 justify-between text-sm pt-2">
               <div className="flex items-center gap-1">
                  <Ruler size={12} /> {data.sqm || '---'} m²
               </div>
               <div className="flex items-center gap-1">
                  <BedDouble size={12} /> {data.rooms || '--'}
               </div>
               <div className="flex items-center gap-1">
                  <Calendar size={12} /> {data.year || '--'}
               </div>
            </div>
            <Sheet open={show} onOpenChange={setShow}>
               <SheetContent side="right" className="min-w-[95%] md:min-w-[50%] overflow-y-auto">
                  <ListingPreview data={data} hasEdit />
               </SheetContent>
            </Sheet>
         </div>
         <div className="md:hidden pt-2 mb-4 border-b-8 border-gray-200 w-[calc(100%+4rem)] -mx-8" />
      </>
   );
};
