import { distanceBetweenCoordinates, getSquareMeterPrice, Listing } from "@/model/Listing"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ListingPreview } from "./ListingPreview";
import { Sheet, SheetContent } from "./ui/sheet";
import { useState } from "react";
import { useStorage } from "@/context/storage-provider";
import { motion } from "motion/react";
import Flag from 'react-world-flags';
import { useDeleteProperty } from "@/lib/fetch";
import { Trash } from "./animate-ui/icons/trash";
import { List } from "./animate-ui/icons/list";
import { Heart } from "./animate-ui/icons/heart";
import { MapPin } from "./animate-ui/icons/map-pin";
import { BedDouble, Calendar, Car, Ruler } from "lucide-react";

interface HouseCardProps {
   data: Listing;
   isSelected: boolean;
   onSelect?: () => void;
   isMarked?: boolean;
}

export const HouseCard = ({ data, isSelected, onSelect, isMarked = false }: HouseCardProps) => {
   // state
   const [show, setShow] = useState(false);

   // hooks
   const $save = useStorage();

   // queries
   const $delete = useDeleteProperty();

   const distance = $save.location && data.location ? distanceBetweenCoordinates($save.location, { lat: data.location.lat, lon: data.location.lon }) : null;

   function onDelete() {
      $delete.mutateAsync(data.uuid);
   }

   return (
      <>
         <Card className={`w-full rounded-xl shadow-md hover:shadow-xl transition-all py-0 overflow-clip relative ${isMarked ? 'grayscale' : ''}`}>
            {isMarked && (
               <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                     backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 6px)",
                     backgroundColor: "rgba(255,255,255,0.4)",
                  }}
               />
            )}

            <CardHeader className="p-0 relative">
               <div className="w-full h-48 overflow-y-clip">
                  <img
                     src={data.image}
                     alt={data.title}
                     className="w-full h-full object-cover rounded-t-xl hover:scale-120 transition-all duration-500"
                  />
               </div>

               {!!data.score && (
                  <div className="absolute top-38 right-2 text-sm text-white bg-red-800/90 rounded-full p-1 flex justify-center items-center w-8 h-8">
                     {data.score}
                  </div>
               )}


               <motion.button
                  type="button"
                  className="absolute top-2 left-2 bg-black bg-opacity-75 rounded-full p-2"
                  onClick={onDelete}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
               >
                  <Trash animateOnHover size={14} className="text-white" />
               </motion.button>

               <motion.button
                  type="button"
                  className={`absolute top-2 right-10 bg-black bg-opacity-75 rounded-full p-2`}
                  onClick={() => setShow(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ y: -5 }}
                  transition={{ duration: 0.2 }}
               >
                  <List animateOnHover size={14} className="text-white" />
               </motion.button>
               <motion.button
                  type="button"
                  className={`absolute top-2 right-2 ${isSelected ? 'bg-red-700' : 'bg-black'} bg-opacity-75 rounded-full p-2`}
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
                  <Heart animateOnHover size={14} className="text-white" />
               </motion.button>

               <div className="p-2 min-w-0">
                  <div className="text-gray-700 text-xs truncate">{data.contact}</div>
                  <h2 className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{data.title}</h2>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                     <MapPin animateOnHover size={14} /> <span className="truncate">{data.location.display}</span> <Flag code={data.location.code} width={16} />
                  </div>
                  {distance && (<div className="text-sm text-gray-500 flex items-center gap-1">
                     <Car size={14} /> {distance.toFixed(1)} km entfernt
                  </div>)}

                  <div className="text-xl font-semibold text-primary mt-2">
                     € {Number.parseFloat(data.price || '0').toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 -mt-1">{getSquareMeterPrice(data.price, data.sqm)}</div>
               </div>
               {!$save.filter.compactView && (
                  <div className="flex gap-1 justify-between text-sm px-2">
                     <div className="flex items-center gap-1">
                        <Ruler size={14} /> {data.sqm || '---'} m²
                     </div>
                     <div className="flex items-center gap-1">
                        <BedDouble size={14} /> {data.rooms || '--'}
                     </div>
                     <div className="flex items-center gap-1">
                        <Calendar size={14} /> {data.year || '--'}
                     </div>
                  </div>
               )}
            </CardHeader>
            {!$save.filter.compactView && (
               <CardContent className="p-2 pt-0">
                  <div className="text-sm text-gray-700 mt-1 leading-snug">
                     {data.description.slice(0, 100)}{data.description.length > 100 ? '...' : ''}
                  </div>
               </CardContent>
            )}
         </Card >
         <Sheet open={show} onOpenChange={setShow}>
            <SheetContent side="right" className="min-w-[95%] md:min-w-[40%] overflow-y-auto">
               <ListingPreview data={data} hasEdit />
            </SheetContent>
         </Sheet>
      </>
   );
};
