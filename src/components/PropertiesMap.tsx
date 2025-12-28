'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { divIcon } from 'leaflet';
import { Coordinates } from '@/model/Listing';
import { PageLayout } from './PageLayout';
import { Header } from './layout/Header';

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
   readonly listings: MarkerItem[];
}

export default function PropertiesMap({ listings }: Props) {
   /**
    * create custo html marker
    * @param item 
    * @returns 
    */
   function renderCustomMarker(item: MarkerItem) {

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
            key={item.name}
            position={[item.coords.lat, item.coords.lon]}
            icon={customMarkerIcon}>
            <Popup>
               <div className="-m-1 flex gap-x-2">
                  {item.image && <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />}
                  <div className="flex flex-col text-xs">
                     <strong>{item.name}</strong>
                     <div className="text-primary">EUR {item.price}</div>
                  </div>
               </div>
            </Popup>
         </Marker>);
   }

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
                  url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                  minZoom={0}
                  maxZoom={20}
                  attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               />

               {listings.map(renderCustomMarker)}
            </MapContainer>
         </div>
      </PageLayout>
   )
}