'use client';

import { Listing } from '@/model/Listing';
import { useMemo } from 'react';
import { Link2 } from './animate-ui/icons/link-2';
import Link from 'next/link';
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from './ui/map';

interface Props {
   readonly listings: Listing[];
}

export default function PropertiesMap({ listings }: Props) {
   /**
    * create custom html marker
    * @param item 
    * @returns 
    */
   function renderCustomMarker(item: Listing) {
      return (
         <MapMarker
            key={item.title}
            latitude={item.location.lat}
            longitude={item.location.lon}>
            <MarkerContent>
               <MarkerLabel position="bottom">
                  <div className="bg-black/80 text-white py-1 px-2 rounded-md">EUR {item.price.toString()}</div>
               </MarkerLabel>
            </MarkerContent>
            <MarkerPopup className="p-0 w-62">
               <div className="flex flex-col gap-2">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-30 object-cover overflow-hidden rounded-t-md" />}
                  <div className="p-2">
                     <div className="font-semibold text-lg">EUR {item.price}</div>
                     <div>{item.title}</div>
                     <div className="justify-end flex mt-2">
                        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center rounded-md text-xs bg-secondary p-2 gap-1">
                           <Link2 size={18} /> Zur Webseite
                        </Link>
                     </div>
                  </div>
               </div>
            </MarkerPopup>
         </MapMarker>);
   }

   // derived state
   const markerList = useMemo((): Listing[] => {
      return listings?.filter((item: Listing) => item.location.lat !== undefined && item.location.lon !== undefined)
         ?? [];
   }, [listings]);


   return (
      <div className="w-full h-[calc(100vh-8rem)] z-1">
         <Map center={[markerList.length > 0 ? markerList[0].location.lon : 0, markerList.length > 0 ? markerList[0].location.lat : 0]}
            zoom={11}
         >
            {listings.map(renderCustomMarker)}
         </Map>
      </div>
   )
}