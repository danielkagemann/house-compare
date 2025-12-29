'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { divIcon } from 'leaflet';
import { Listing } from '@/model/Listing';
import { useMemo } from 'react';
import { Link2 } from './animate-ui/icons/link-2';
import Link from 'next/link';

L.Icon.Default.mergeOptions({
   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

      const div = document.createElement('div');
      div.style.backgroundColor = "black";
      div.style.opacity = "0.7";
      div.style.color = "white";
      div.style.padding = "0.2rem 0.6rem";
      div.style.fontSize = "0.9rem";
      div.style.borderRadius = "1rem";
      div.style.width = "max-content";
      div.innerText = 'EUR ' + item.price.toString();

      const customMarkerIcon = divIcon({
         html: div
      });

      return (
         <Marker
            key={item.title}
            position={[item.location.lat, item.location.lon]}
            icon={customMarkerIcon}>
            <Popup>
               <div className="flex flex-col gap-2">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-30 object-cover rounded-t-[12px]" />}
                  <div className="p-2">
                     <div className="font-semibold text-lg">EUR {item.price}</div>
                     <div>{item.title}</div>
                     <div className="flex justify-end mt-2">
                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                           <Link2 size={18} />
                        </Link>
                     </div>
                  </div>
               </div>
            </Popup>
         </Marker>);
   }

   // derived state
   const markerList = useMemo((): Listing[] => {
      return listings?.filter((item: Listing) => item.location.lat !== undefined && item.location.lon !== undefined)
         ?? [];
   }, [listings]);


   return (
      <div className="w-full h-[calc(100vh-8rem)]">
         <MapContainer center={[markerList.length > 0 ? markerList[0].location.lat : 0, markerList.length > 0 ? markerList[0].location.lon : 0]}
            zoom={11}
            scrollWheelZoom={false}
            className="w-full h-full z-1"
         >
            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {listings.map(renderCustomMarker)}
         </MapContainer>
      </div>
   )
}