"use client";

import { getSquareMeterPrice, Listing } from "@/model/Listing";
import { BedDouble, Calendar, MapPin, Ruler, User } from "lucide-react";
import { ReadMore } from "./ui/Readmore";
import { FeatureList, Features } from "./Features";
import Flag from 'react-world-flags'
import { useGetPropertyList } from "@/lib/fetch";
import { PageLayout } from "./PageLayout";
import { Header } from "./layout/Header";
import { Loading } from "./Loading";
import { useMemo } from "react";
import { RenderIf } from "./renderif";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
const SmallMap = dynamic(() => import("./SmallMap"), {
   ssr: false,
});
type BestOption = Record<string, { value: number, index: number }>;

export const ListingComparison = () => {
   // hooks
   const t = useTranslations("house");

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

   const bestOption = useMemo((): BestOption => {
      // iterate over all data elements and summarize the best options
      const summary: BestOption = {};

      if (!data) {
         return summary;
      }

      // find the index with the best value for each attribute
      data.forEach((item: Listing, index: number) => {
         // price
         const price = Number.parseFloat(item.price);
         if (!summary['price'] || price < summary['price'].value) {
            summary['price'] = { value: price, index };
         }

         // sqmPrice
         const sqmPrice: number = getSquareMeterPrice(item.price, item.sqm, true) as number;
         if (!summary['sqmPrice'] || sqmPrice < summary['sqmPrice'].value) {
            summary['sqmPrice'] = { value: sqmPrice, index };
         }

         // rooms
         const rooms = Number.parseFloat(item.rooms);
         if (!summary['rooms'] || rooms > summary['rooms'].value) {
            summary['rooms'] = { value: rooms, index };
         }

         // year
         const year = Number.parseFloat(item.year);
         if (!summary['year'] || year > summary['year'].value) {
            summary['year'] = { value: year, index };
         }

         // sqm
         const sqm = Number.parseFloat(item.sqm);
         if (!summary['sqm'] || sqm > summary['sqm'].value) {
            summary['sqm'] = { value: sqm, index };
         }
      });

      return summary;
   }, [data]);

   function getTopOptionIndex() {
      const indices = Object.values(bestOption).map(item => item.index);

      const top: number[] = new Array(data?.length ?? 0).fill(0);
      indices.forEach((idx) => {
         top[idx] = top[idx] + 1;
      });
      return top.indexOf(Math.max(...top));
   }

   function renderCell(item: Listing, attr: string, index: number) {
      return (
         <td key={`comparison-cell-${item.uuid}`} className="border-b border-gray-200 p-2 align-top w-full md:w-1/3">
            <RenderIf condition={attr === 'image'}>
               <div className="relative w-full h-20 md:h-52">
                  <img src={item.image} alt={`Listing ${item.uuid}`} className="w-full h-full object-cover rounded-xl" />
                  <RenderIf condition={getTopOptionIndex() === index}>
                     <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm">Top</div>
                  </RenderIf>
               </div>
            </RenderIf>

            <RenderIf condition={attr === 'title'}>
               <strong>{item.title}</strong>
            </RenderIf>

            <RenderIf condition={attr === 'price'}>
               <div className={`text-sm md:text-lg font-bold ${bestOption['price']?.index === index ? 'text-green-700' : 'text-red-700'}`}>EUR {item.price}</div>
            </RenderIf>

            <RenderIf condition={attr === 'location'}>
               <div className="flex gap-1 items-center text-gray-700"><MapPin size={14} /> {item.location.display}</div>
               <RenderIf condition={item.location.lat !== undefined && item.location.lon !== undefined}>
                  <SmallMap location={{ lat: item.location.lat, lon: item.location.lon }} className="hidden md:block h-40 mt-2 rounded-md" />
               </RenderIf>
            </RenderIf>

            <RenderIf condition={attr === 'country'}>
               <div className="flex gap-1 items-center text-gray-700"><Flag code={item.location.code} width={16} /> {item.location.country}</div>
            </RenderIf>

            <RenderIf condition={attr === 'year'}>
               <div className={`flex gap-1 items-center text-gray-700 ${bestOption['year']?.index === index ? 'text-green-700' : 'text-red-700'}`}><Calendar size={14} /> {item.year}</div>
            </RenderIf>

            <RenderIf condition={attr === 'rooms'}>
               <div className={`flex gap-1 items-center text-gray-700 ${bestOption['rooms']?.index === index ? 'text-green-700' : 'text-red-700'}`}><BedDouble size={14} /> {item.rooms}</div>
            </RenderIf>

            <RenderIf condition={attr === 'sqm'}>
               <div className={`flex gap-1 items-center text-gray-700 ${bestOption['sqm']?.index === index ? 'text-green-700' : 'text-red-700'}`}><Ruler size={14} /> {item.sqm} m²</div>
            </RenderIf>
            <RenderIf condition={attr === 'sqmPrice'}>
               <div className={`text-gray-700 ${bestOption['sqmPrice']?.index === index ? 'text-green-700' : 'text-red-700'}`}>
                  {t("persqm")}: {getSquareMeterPrice(item.price, item.sqm)}
               </div>
            </RenderIf>
            <RenderIf condition={attr === 'description'}>
               <ReadMore text={item.description} />
            </RenderIf>
            <RenderIf condition={attr === 'features'}>
               <Features features={getFeatures(index)} />
            </RenderIf>
            <RenderIf condition={attr === 'contact'}>
               <div className="flex gap-1 text-gray-700"><User size={14} /> {item.contact}</div>
            </RenderIf>
         </td >
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
         <h2 className="font-bold text-lg">{t("compare")}</h2>
         <div className="text-gray-600 text-sm mb-4">
            {t("compareDescription")}
         </div>
         <div className="overflow-x-auto block">
            <table className="border-collapse min-w-full text-xs md:text-base">
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