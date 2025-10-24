import { Listing } from "@/model/Listing"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Calendar, Home, MapPin, PlusCircle, Ruler, Trash } from "lucide-react";

interface HouseCardProps {
   data: Listing;
}

export const HouseCard = ({ data }: HouseCardProps) => {
   return (
      <Card className="w-1/3 rounded-2xl shadow-md hover:shadow-xl transition-all py-0 overflow-clip">
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

            <button type="button" className="absolute top-2 left-2 bg-black bg-opacity-75 rounded-full p-2">
               <Trash size={14} className="text-white" />
            </button>

            <div className="p-2 min-w-0">
               <div className="text-gray-700 text-xs truncate">{data.contact}</div>
               <h2 className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{data.title}</h2>
               <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} /> {data.location}
               </p>
               <p className="text-xl font-semibold text-green-700 mt-2">
                  € {data.price.toLocaleString()}
               </p>
            </div>
            <div className="flex gap-1 justify-between text-sm px-2">
               <div className="flex items-center gap-1">
                  <Ruler size={14} /> {data.sqm} m²
               </div>
               <div className="flex items-center gap-1">
                  <BedDouble size={14} /> {data.rooms}
               </div>
               <div className="flex items-center gap-1">
                  <Calendar size={14} /> {data.year}
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-2">
            <details>
               <summary className="text-sm font-semi-bold text-gray-600 cursor-pointer">
                  Beschreibung
               </summary>
               <p className="text-sm text-gray-700 mt-1 leading-snug">
                  {data.description}
               </p>
            </details>
         </CardContent>
      </Card>
   );
};
