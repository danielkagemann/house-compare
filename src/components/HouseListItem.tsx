import { Listing } from "@/model/Listing";
import { ReadMore } from "./ui/Readmore";
import { BedDouble, Calendar, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { Rank } from "./layout/rank";

interface HouseListItemProps {
   item: Listing;
}

export const HouseListItem = ({ item }: HouseListItemProps) => {
   function renderTitle() {
      const title = <h3 className="text-lg font-bold">{item.title}</h3>;
      if (item.url && item.url.length > 0) {
         return (<Link href={item.url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {title}
         </Link>);
      }
      return title;
   }

   return (<div className="md:shadow-md md:rounded-md md:p-4">
      <div className="flex gap-2 flex-col lg:flex-row relative">
         <img
            src={item.image}
            alt={item.title}
            className="w-full lg:w-64 h-48 object-cover rounded-md"
         />

         <div className="absolute top-2 right-2">
            <Rank value={item.rank} />
         </div>
         <div className="space-y-1">
            {renderTitle()}

            <div className="text-sm text-gray-500 flex items-center gap-1">
               <MapPin size={14} /> <span className="truncate">{item.location.display}</span>
            </div>
            <div className="flex gap-3 text-sm space-x-4">
               <div className="flex items-center gap-1">
                  <Ruler size={14} /> {item.sqm || '---'} m²
               </div>
               <div className="flex items-center gap-1">
                  <BedDouble size={14} /> {item.rooms || '--'}
               </div>
               <div className="flex items-center gap-1">
                  <Calendar size={14} /> {item.year || '--'}
               </div>
            </div>
            <div className="text-xl font-semibold mt-2">
               EUR {Number.parseFloat(item.price).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600"><ReadMore text={item.description} /></div>
         </div>
      </div>
   </div>)

}