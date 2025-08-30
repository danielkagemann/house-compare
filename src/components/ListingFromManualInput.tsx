import { Listing } from "@/model/Listing";
import { Fragment, useState } from "react";

type Props = {
   onChange: (value: Listing | null) => void;
};

type Layout = {
   attr: string;
   label: string;
   field: 'input' | 'area' | 'readonly' | 'features';
};

export const ListingFromManualInput = ({ onChange }: Props) => {
   const [data, setData] = useState<Record<string, any>>({ uuid: Date.now().toString(), pricePerSqm: '-', price: '0', sqm: '0' });
   const [features, setFeatures] = useState<string>('');

   const attributes: Layout[] = [
      { field: 'readonly', attr: 'uuid', label: 'Eindeutige ID' },
      { field: 'input', attr: 'url', label: 'URL zum Angebot' },
      { field: 'input', attr: 'title', label: 'Titel des Hauses' },
      { field: 'input', attr: 'location', label: 'Standort (Stadt, Provinz)' },
      { field: 'input', attr: 'price', label: 'Preis in Euro' },
      { field: 'input', attr: 'sqm', label: 'Wohnfläche in Quadratmeter' },
      { field: 'readonly', attr: 'pricePerSqm', label: 'Quadratmeterpreis' },
      { field: 'input', attr: 'rooms', label: 'Anzahl Schlafzimmer' },
      { field: 'input', attr: 'image', label: 'URL zum Bild' },
      { field: 'area', attr: 'description', label: 'Beschreibung des Hauses' },
      { field: 'input', attr: 'contact', label: 'Name. des Maklers' },
      { field: 'input', attr: 'year', label: 'Baujahr' },
      { field: 'features', attr: 'features', label: 'Features (Komma getrennt)' }
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
      return (
         <Fragment key={item.attr}>
            <p className="text-gray-500 text-sm">{item.label}</p>
            {item.field === 'features' && <input type="text" value={features} onChange={onUpdate(item.attr)} className="border-1 w-full bg-gray-50 p-1 border-gray-500" />}
            {item.field === 'input' && <input type="text" value={data[item.attr] ?? ''} onChange={onUpdate(item.attr)} className="border-1 w-full bg-gray-50 p-1 border-gray-500" />}
            {item.field === 'area' && <textarea rows={4} value={data[item.attr] ?? ''} onChange={onUpdate(item.attr)} className="border-1 w-full bg-gray-50 p-1 border-gray-500" />}
            {item.field === 'readonly' && <p className="text-gray-500 border-1 w-full bg-gray-200 p-1 border-gray-500">{data[item.attr]}</p>}
         </Fragment>
      );
   }

   function canSave() {
      return attributes.every((item: Layout) => data[item.attr]?.length > 0);
   }

   return (
      <>
         <div className="flex flex-col gap-1">
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


