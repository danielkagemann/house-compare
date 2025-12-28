'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { Coordinates } from '@/model/Listing';
import { useEffect, useState } from 'react';
L.Icon.Default.mergeOptions({
   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type Props = {
   location: Coordinates;
   className?: string;
}

export default function SmallMap({ location, className }: Props) {
   // state
   const [coords, setCoords] = useState<LatLngTuple>([location.lat, location.lon]);

   useEffect(() => {
      setCoords([location.lat, location.lon]);
   }, [location]);

   const cartoAttribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>';

   const carto = (style: string) =>
      `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;

   return (
      <div className={`w-full h-40 rounded-xl overflow-hidden shadow-lg ${className}`}>
         <MapContainer center={coords}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
         >
            {/* <TileLayer
               url={carto("light_all")}
               attribution={cartoAttribution}
            /> */}

            <TileLayer
               url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
               minZoom={0}
               maxZoom={20}
               attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {coords &&
               <Marker position={coords} />}
         </MapContainer>
      </div>
   );
}
