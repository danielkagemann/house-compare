'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Coordinates } from '@/model/Listing';
import { PageLayout } from './PageLayout';
import { Header } from './Header';

L.Icon.Default.mergeOptions({
   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export interface MarkerItem {
   coords: Coordinates;
   name: string;
   image: string;
   price: number;
};

interface Props {
   listings: MarkerItem[];
}

export default function PropertiesMap({ listings }: Props) {
   return (
      <PageLayout>
         <Header />
         <div className="w-full h-screen">
            <MapContainer center={[listings.length > 0 ? listings[0].coords.lat : 0, listings.length > 0 ? listings[0].coords.lon : 0]}
               zoom={11}
               scrollWheelZoom={false}
               className="w-full h-full z-1"
            >
               <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
               />

               {listings.map((item: MarkerItem, index: number) => (
                  <Marker key={index} position={[item.coords.lat, item.coords.lon]} >
                     <Popup>
                        <div className="-m-1 flex gap-x-2">
                           {item.image && <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />}
                           <div className="flex flex-col text-xs">
                              <strong>{item.name}</strong>
                              <div className="text-primary">EUR {item.price}</div>
                           </div>
                        </div>
                     </Popup>
                  </Marker>
               ))}
            </MapContainer>
         </div>
      </PageLayout>
   )
}