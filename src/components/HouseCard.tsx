import { getSquareMeterPrice, Listing } from "@/model/Listing"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BedDouble, Calendar, Car, Heart, PencilLine, MapPin, Ruler, Trash } from "lucide-react";
import { ListingPreview } from "./ListingPreview";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { use, useState } from "react";
import { useStorage } from "@/hooks/storage-provider";
import { useCoordinates } from "@/hooks/useCoordinates";

interface HouseCardProps {
   data: Listing;
   isSelected: boolean;
   onSelect?: () => void;
}

export const HouseCard = ({ data, isSelected, onSelect }: HouseCardProps) => {
   // state
   const [show, setShow] = useState(false);

   // hooks
   const $coords = useCoordinates();
   const $save = useStorage();

   const distance = $save.location && data.coordinates ? $coords.distanceBetween($save.location, data.coordinates) : null;

   const updateListing = (updated: Listing) => {
      $save.listingUpdate(updated);
   };

   return (
      <>
         <Card className="w-full rounded-2xl shadow-md hover:shadow-xl transition-all py-0 overflow-clip">
            <CardHeader className="p-0 relative">
               <motion.img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
               />

               <button type="button" className="absolute top-2 left-2 bg-black bg-opacity-75 rounded-full p-2">
                  <Trash size={14} className="text-white" />
               </button>

               <button type="button" className={`absolute top-2 right-10 bg-black bg-opacity-75 rounded-full p-2`} onClick={() => setShow(true)}>
                  <PencilLine size={14} className="text-white" />
               </button>

               <button type="button" className={`absolute top-2 right-2 ${isSelected ? 'bg-red-700' : 'bg-black'} bg-opacity-75 rounded-full p-2`} onClick={onSelect}>
                  <Heart size={14} className="text-white" />
               </button>

               <div className="p-2 min-w-0">
                  <div className="text-gray-700 text-xs truncate">{data.contact}</div>
                  <h2 className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{data.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                     <MapPin size={14} /> {data.location}
                  </p>
                  {distance && (<p className="text-sm text-gray-500 flex items-center gap-1">
                     <Car size={14} /> {distance.toFixed(1)} km entfernt
                  </p>)}

                  <p className="text-xl font-semibold text-primary mt-2">
                     € {parseFloat(data.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 -mt-1">{getSquareMeterPrice(data.price, data.sqm)}</p>
               </div>
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
            </CardHeader>
            <CardContent className="p-2">
               <p className="text-sm text-gray-700 mt-1 leading-snug">
                  {data.description.slice(0, 100)}{data.description.length > 100 ? '...' : ''}
               </p>
            </CardContent>
         </Card >
         <Sheet open={show} onOpenChange={setShow}>
            <SheetContent side="right" className="min-w-[40%]">
               <ListingPreview data={data} hasEdit/>
            </SheetContent>
         </Sheet>
      </>
   );
};
