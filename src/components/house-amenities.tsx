import { amenityTitle, distanceBetweenCoordinates, Location } from "@/model/Listing";

interface HouseAmenitiesProps {
   item: Location;
}

export const HouseAmenities = ({ item }: HouseAmenitiesProps) => {
   if (!item.poi || item.poi.length === 0) {
      return null;
   }

   const types = Array.from(new Set(item.poi?.map(poi => poi.type)));

   // for each type we need the nearest amenity of that type
   const nearestAmenities = types.map(type => {
      const amenitiesOfType = item.poi!.filter(poi => poi.type === type);
      amenitiesOfType.sort((a, b) => {
         const distA = distanceBetweenCoordinates(item, a.coordinates);
         const distB = distanceBetweenCoordinates(item, b.coordinates);
         return distA - distB;
      });
      return amenitiesOfType[0];
   });

   return (
      <div className="text-sm mt-2">
         {nearestAmenities.map((poi, idx) => (
            <div key={idx}>
               <strong>{amenityTitle(poi.type)}</strong> - {poi.name || 'unbekannt'} {distanceBetweenCoordinates(item, poi.coordinates).toFixed(2)}km
            </div>
         ))}
      </div>
   );
};