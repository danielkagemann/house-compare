'use client';
import { Map, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import { Coordinates, distanceBetweenCoordinates, POI } from '@/model/Listing';
import { useTranslations } from "next-intl";

type Props = {
   readonly location: Coordinates;
   readonly className?: string;
   readonly amenities?: POI[];
}

export default function SmallMap({ location, className, amenities = [] }: Props) {
   // hooks
   const t = useTranslations("house");

   function renderAmenities() {
      if (amenities.length === 0) {
         return null;
      }

      return amenities.map((place: POI) => (
         <MapMarker
            key={place.name}
            latitude={place.coordinates.lat}
            longitude={place.coordinates.lon}>
            <MarkerContent>
               <div className="w-3 h-3 rounded-full bg-red-700 border-2 border-white shadow-lg z-10 transform -translate-x-1/2 -translate-y-1/2" />
               <MarkerTooltip>
                  <strong>{place.name}</strong>
                  <p>{distanceBetweenCoordinates(location, place.coordinates).toFixed(1)} km {t('away')}</p>
               </MarkerTooltip>
            </MarkerContent>
         </MapMarker>
      ));
   }

   return (
      <div className={`w-full h-40 rounded-xl overflow-hidden shadow-lg ${className}`}>
         <Map center={[location.lon, location.lat]}
            zoom={11}
         >
            {
               location &&
               <MapMarker latitude={location.lat} longitude={location.lon}>
                  <MarkerContent>
                     <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg z-10 transform -translate-x-1/2 -translate-y-1/2" />
                  </MarkerContent>
               </MapMarker>
            }

            {renderAmenities()}
         </Map>
      </div>
   );
}
