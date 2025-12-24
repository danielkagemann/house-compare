import { distanceBetweenCoordinates, Location } from "@/model/Listing";

interface ListOfAmenitiesProps {
   item: Location;
}
export const ListOfAmenities = ({ item }: ListOfAmenitiesProps) => {
   const types = Array.from(new Set(item.poi?.map(poi => poi.type)));

   if (item.poi === undefined || item.poi.length === 0) {
      return <p>Keine Sehenswürdigkeiten in der Nähe gefunden.</p>;
   }

   function typeTitle(type: string) {
      switch (type) {
         case 'supermarket':
            return 'Supermärkte';
         case 'restaurant':
            return 'Restaurants';
         case 'beach':
            return 'Strände';
         default:
            return type;
      }
   }

   return (
      <div className="text-sm mt-2">
         {
            types.map((type, idx) => (
               <div key={idx} className="mb-2">
                  <strong>{typeTitle(type)}</strong>
                  <div className="bg-gray-100 rounded p-2 flex flex-col">
                     {item.poi!.filter(poi => poi.type === type).map((poi, pidx) => (
                        <div key={pidx}>{poi.name || 'unbekannt'} <strong>{distanceBetweenCoordinates(item, poi.coordinates).toFixed(2)}km</strong> entfernt</div>
                     ))}
                  </div>
               </div>
            ))
         }
      </div>
   );
};