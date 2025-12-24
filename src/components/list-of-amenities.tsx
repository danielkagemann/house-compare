import { distanceBetweenCoordinates, Location } from "@/model/Listing";

interface ListOfAmenitiesProps {
   item: Location;
}
export const ListOfAmenities = ({ item }: ListOfAmenitiesProps) => {
   const types = Array.from(new Set(item.poi?.map(poi => poi.type)));

   if (item.poi === undefined || item.poi.length === 0) {
      return <p>Keine Sehenswürdigkeiten in der Nähe gefunden.</p>;
   }

   return (
      <>
         {
            types.map((type, idx) => (
               <div key={idx} className="mb-4">
                  <strong>{type}</strong>
                  <ul>
                     {item.poi!.filter(poi => poi.type === type).map((poi, pidx) => (
                        <li key={pidx}>{poi.name} {distanceBetweenCoordinates(item, poi.coordinates).toFixed(2)}km entfernt</li>
                     ))}
                  </ul>
               </div>
            ))
         }
      </>
   );
};