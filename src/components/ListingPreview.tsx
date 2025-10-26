import { Listing } from "@/model/Listing"
import { ReadMore } from "./ui/Readmore";
import { BedDouble, Calendar, MapPin, Ruler } from "lucide-react";

interface Props {
   data: Listing;
   hasEdit?: boolean;
};

export const ListingPreview = ({ data, hasEdit = false }: Props) => {

   const imageSrc = data.image || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/no-image.png`;

   function calculateAllFilled() {
      const keys = Object.keys(data);
      const filled = keys.filter(key => {
         const value = data[key as keyof Listing];
         if (Array.isArray(value)) {
            return value.length > 0;
         }
         if (typeof value === 'string') {
            return value.trim().length > 0;
         }
         if (value?.lat && value?.lon) {
            return true;
         }
         return false;
      });
      return Math.round((filled.length * 100) / keys.length);
   }

   const percentage = calculateAllFilled();

   return (
      <div className="h-screen border-l-1 border-gray-200 p-4 flex flex-col space-y-2">
         <strong>Vorschau</strong>

         <div className="flex justify-between text-xs">
            <div className="text-xs">refID: {data.uuid}
               {hasEdit && (<><br /><a href={`/details/?id=${data.uuid}`} className="text-primary font-bold text-sm hover:underline">Informationen bearbeiten</a></>)}
            </div>
            <div className={`w-10 h-10 ${percentage < 50 ? 'bg-red-800' : percentage < 80 ? 'bg-yellow-800' : 'bg-green-800'} rounded-full flex items-center justify-center text-white`}>
               {percentage}%
            </div>
         </div>
         <img
            src={imageSrc}
            alt={data.title}
            className="w-full h-48 object-cover rounded-xl"
         />
         {data.url && <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-sm hover:underline break-all">Link zum Angebot</a>}
         {data.contact.length > 0 && <div className="text-xs text-gray-700 truncate w-min-0">{data.contact}</div>}
         {data.title.length > 0 && <h2 className="font-bold text-lg">{data.title}</h2>}

         {data.location.length > 0 &&
            <div className="text-sm text-gray-500 flex items-center gap-1">
               <MapPin size={14} /> {data.location}
            </div>}
         {data.price.length > 0 && <p className="text-primary font-bold text-xl">{`€ ${parseFloat(data.price).toLocaleString()}` || '--'}</p>}

         <div className="flex gap-1 justify-between text-sm px-2">
            {data.sqm.length > 0 && (
               <div className="flex items-center gap-1">
                  <Ruler size={16} /> {data.sqm} m²
               </div>)}
            {data.rooms.length > 0 && (
               <div className="flex items-center gap-1">
                  <BedDouble size={16} /> {data.rooms}
               </div>)}
            {data.year.length > 0 && (
               <div className="flex items-center gap-1">
                  <Calendar size={16} /> {data.year}
               </div>)}
         </div>
         {data.features.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
               {data.features.map((feature, index) => (
                  <div key={index} className="text-xs bg-gray-200 text-gray-700 rounded-md p-1">{feature}</div>
               ))}
            </div>)}
         {data.description.length > 0 && <div className="text-sm text-gray-700"><ReadMore text={data.description} /></div>}
      </div>
   );
}