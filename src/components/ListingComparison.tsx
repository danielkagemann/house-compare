"use client";

import { getSquareMeterPrice, Listing } from "@/model/Listing";
import { BedDouble, Calendar, MapPin, Ruler, User } from "lucide-react";
import { ReadMore } from "./ui/Readmore";
import { FeatureList, Features } from "./Features";
import Flag from 'react-world-flags'
import { useGetPropertyList } from "@/lib/fetch";
import { PageLayout } from "./PageLayout";
import { Header } from "./Header";
import { Loading } from "./Loading";

export const ListingComparison = () => {

   // query selected items
   const { data, isLoading } = useGetPropertyList(true);

   function getFeatures(index: number): FeatureList[] {
      // get other features translated to only string array and remove this one
      const tmp = [...data];
      tmp.splice(index, 1);

      const flatList = tmp.map((item) => item?.features ?? []).flat();

      const currentItem = data[index];

      // get the features NOT in otherFeatures
      const highlight = (currentItem?.features ?? []).filter((feature: string) => !flatList.includes(feature));

      return currentItem.features.map((val: string) => ({
         value: val,
         highlight: highlight.includes(val)
      }))
   }

   function renderCell(item: Listing, attr: string, index: number) {
      return (
         <td key={`comparison-cell-${item.uuid}`} className="border-b border-gray-200 p-2 align-top w-full md:w-1/3">
            {attr === 'image' && <img src={item.image} alt={`Listing ${item.uuid}`} className="w-full h-52 object-cover rounded-xl" />}
            {attr === 'title' && <strong>{item.title}</strong>}
            {attr === 'price' && <div className="text-primary font-bold text-lg">€ {item.price}</div>}
            {attr === 'location' && <div className="flex gap-1 items-center text-gray-700"><MapPin size={14} /> {item.location.display}</div>}
            {attr === 'country' && <div className="flex gap-1 items-center text-gray-700"><Flag code={item.location.code} width={16} /> {item.location.country}</div>}
            {attr === 'year' && <div className="flex gap-1 items-center text-gray-700"><Calendar size={14} /> {item.year}</div>}
            {attr === 'rooms' && <div className="flex gap-1 items-center text-gray-700"><BedDouble size={14} /> {item.rooms}</div>}
            {attr === 'sqm' && <div className="flex gap-1 items-center text-gray-700"><Ruler size={14} /> {item.sqm} m²</div>}
            {attr === 'sqmPrice' && getSquareMeterPrice(item.price, item.sqm)}
            {attr === 'description' && <ReadMore text={item.description} />}
            {attr === 'features' && <Features features={getFeatures(index)} />}
            {attr === 'contact' && <div className="flex gap-1 items-center text-gray-700"><User size={14} /> {item.contact}</div>}
         </td>
      );
   }

   function renderRow(attr: string) {
      return (
         <tr>
            {data.map((item: Listing, index: number) => renderCell(item, attr, index))}
         </tr>
      );
   }

   if (isLoading) {
      return <Loading />;
   }

   return (
      <PageLayout>
         <Header />
         <h2 className="font-bold text-lg">Immobilienvergleich</h2>
         <div className="overflow-x-auto block">
            <table className="border-collapse min-w-full">
               <tbody>
                  {renderRow('image')}
                  {renderRow('price')}
                  {renderRow('title')}
                  {renderRow('location')}
                  {renderRow('country')}
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
      </PageLayout>
   );
}