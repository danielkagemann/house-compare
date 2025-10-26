"use client";

import { useStorage } from "@/hooks/storage-provider";
import { getSquareMeterPrice, Listing } from "@/model/Listing";
import { BedDouble, Calendar, MapPin, Ruler, User } from "lucide-react";
import { useEffect, useState } from "react";
import { ReadMore } from "./ui/Readmore";
import { Features } from "./Features";

export const ListingComparison = () => {
   // hooks
   const $storage = useStorage();

   // state
   const [items, setItems] = useState<Listing[]>([]);

   useEffect(() => {
      const ls = [];
      for (const uuid of $storage.selected) {
         const item = $storage.listings.find(l => l.uuid.trim() === uuid.trim());
         if (item) {
            ls.push(item);
         }
      }
      setItems(ls);
   }, [$storage.selected, $storage.listings]);

   function renderCell(item: Listing, attr: string) {
      return (
         <td key={`comparison-cell-${item.uuid}`} className="border-b border-gray-200 p-2 align-top w-1/3">
            {attr === 'image' && <img src={item.image} alt={`Listing ${item.uuid}`} className="w-full h-52 object-cover rounded-xl" />}
            {attr === 'title' && <strong>{item.title}</strong>}
            {attr === 'price' && <div className="text-primary">€ {item.price}</div>}
            {attr === 'location' && <div className="flex gap-1 items-center text-gray-700"><MapPin size={14} /> {item.location}</div>}
            {attr === 'year' && <div className="flex gap-1 items-center text-gray-700"><Calendar size={14} /> {item.year}</div>}
            {attr === 'rooms' && <div className="flex gap-1 items-center text-gray-700"><BedDouble size={14} /> {item.rooms}</div>}
            {attr === 'sqm' && <div className="flex gap-1 items-center text-gray-700"><Ruler size={14} /> {item.sqm} m²</div>}
            {attr === 'sqmPrice' && getSquareMeterPrice(item.price, item.sqm)}
            {attr === 'description' && <ReadMore text={item.description} />}
            {attr === 'features' && <Features features={item.features} />}
            {attr === 'contact' && <div className="flex gap-1 items-center text-gray-700"><User size={14} /> {item.contact}</div>}
         </td>
      );
   }

   function renderRow(attr: string) {
      return (
         <tr>
            {items.map(item => renderCell(item, attr))}
         </tr>
      );
   }

   return (
      <div className="p-4">
         <h2 className="font-bold text-lg">Immobilienvergleich</h2>

         <table className="border-collapse w-full">
            <tbody>
               {renderRow('image')}
               {renderRow('title')}
               {renderRow('location')}
               {renderRow('price')}
               {renderRow('sqm')}
               {renderRow('sqmPrice')}
               {renderRow('year')}
               {renderRow('rooms')}
               {renderRow('description')}
               {renderRow('features')}
               {renderRow('contact')}
            </tbody>
         </table>
      </div>
   );
}