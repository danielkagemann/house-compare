import { Listing } from "@/model/Listing";
import { BedDouble, Calendar, Euro, ImageUp, Leaf, Link, MapPin, MessageSquareMore, RulerDimensionLine, Tag, User } from "lucide-react";
import { ReactElement, useState } from "react";

type Props = {
   onChange: (value: Listing | null) => void;
};

type Layout = {
   attr: string;
   label: string;
   icon: ReactElement;
   field: 'input' | 'area' | 'readonly' | 'features';
};

export const ListingFromManualInput = ({ onChange }: Props) => {
   const [data, setData] = useState<Record<string, any>>({ uuid: Date.now().toString(), pricePerSqm: '', price: '', sqm: '' });
   const [features, setFeatures] = useState<string>('');

   const attributes: Layout[] = [
      { icon: <Link size={14} />, field: 'input', attr: 'url', label: 'URL zur Webseite' },
      { icon: <Tag size={14} />, field: 'input', attr: 'title', label: 'Titel des Hauses' },
      { icon: <MapPin size={14} />, field: 'input', attr: 'location', label: 'Standort (Stadt, Provinz)' },
      { icon: <Euro size={14} />, field: 'input', attr: 'price', label: 'Preis in Euro' },
      { icon: <RulerDimensionLine size={14} />, field: 'input', attr: 'sqm', label: 'Wohnfläche in Quadratmeter' },
      { icon: <span className="w-3" />, field: 'readonly', attr: 'pricePerSqm', label: 'Der Quadratmeterpreis ist {1} EUR' },
      { icon: <BedDouble size={14} />, field: 'input', attr: 'rooms', label: 'Anzahl Schlafzimmer' },
      { icon: <ImageUp size={14} />, field: 'input', attr: 'image', label: 'URL zum Bild' },
      { icon: <MessageSquareMore size={14} />, field: 'area', attr: 'description', label: 'Beschreibung des Hauses' },
      { icon: <User size={14} />, field: 'input', attr: 'contact', label: 'Name. des Maklers' },
      { icon: <Calendar size={14} />, field: 'input', attr: 'year', label: 'Baujahr' },
      { icon: <Leaf size={14} />, field: 'features', attr: 'features', label: 'Features (Komma getrennt)' }
   ];

   function onUpdate(attr: string) {
      return (e: any) => {
         if (attr === 'features') {
            setFeatures(e.target.value);

            const list = e.target.value.split(',').map((item: string) => item.trim())
            setData({ ...data, [attr]: list });
         } else {
            setData({ ...data, [attr]: e.target.value });
            if (attr === 'price' || attr === 'sqm') {
               setTimeout(() => {
                  const priceNum = parseFloat(data.price.replace(/[^\d]/g, ""));
                  const sqmNum = parseFloat(data.sqm.replace(/[^\d]/g, ""));
                  setData(p => ({
                     ...p,
                     pricePerSqm: !isNaN(priceNum) && !isNaN(sqmNum) && sqmNum > 0
                        ? (Math.round(priceNum / sqmNum) + ' €')
                        : ''
                  }));
               }, 0);
            }
         }
      }
   }


   function renderRow(item: any) {
      const cl = 'border-1 w-full bg-white p-1 border-gray-500 p-2 text-sm focus:outline-none focus:ring-0 focus:bg-gray-100';
      return (
         <div key={item.attr} className="flex gap-1 items-center">
            {item.icon}
            {item.field === 'features' && <input placeholder={item.label} type="text" value={features} onChange={onUpdate(item.attr)} className={cl} />}
            {item.field === 'input' && <input placeholder={item.label} type="text" value={data[item.attr] ?? ''} onChange={onUpdate(item.attr)} className={cl} />}
            {item.field === 'area' && <textarea placeholder={item.label} rows={4} value={data[item.attr] ?? ''} onChange={onUpdate(item.attr)} className={cl} />}
            {(item.field === 'readonly' && data[item.attr]) && <p className="text-gray-500 w-full border-gray-500">{item.label.replace("{1}", data[item.attr])}</p>}
         </div>
      );
   }

   function canSave() {
      return attributes.every((item: Layout) => data[item.attr]?.length > 0);
   }

   return (
      <>
         <div className="flex flex-col gap-2">
            <p className="text-right text-xs font-bold">ID: {data.uuid}</p>
            {
               attributes.map(renderRow)
            }
         </div>

         <div className="flex justify-end mt-4">
            <button type="button"
               disabled={!canSave}
               onClick={() => onChange(data as Listing)}
               className="bg-primary text-white px-2 py-1 cursor-pointer rounded disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700">Hinzufügen</button>
         </div>
      </>
   );
};


