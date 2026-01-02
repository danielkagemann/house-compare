'use client';
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { Coordinates } from '@/model/Listing';

type Props = {
   readonly location: Coordinates;
   readonly className?: string;
}

export default function SmallMap({ location, className }: Props) {

   return (
      <div className={`w-full h-40 rounded-xl overflow-hidden shadow-lg ${className}`}>
         <Map center={[location.lon, location.lat]}
            zoom={11}
         >
            {location &&
               <MapMarker latitude={location.lat} longitude={location.lon}>
                  <MarkerContent>
                     <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg z-10 transform -translate-x-1/2 -translate-y-1/2" />
                  </MarkerContent>
               </MapMarker>}
         </Map>
      </div>
   );
}
