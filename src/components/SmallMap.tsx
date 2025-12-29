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

   return (
      <div className={`w-full h-40 rounded-xl overflow-hidden shadow-lg ${className}`}>
         <MapContainer center={coords}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
         >
            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {coords &&
               <Marker position={coords} />}
         </MapContainer>
      </div>
   );
}
