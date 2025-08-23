import { Listing } from "@/model/Listing";
import { ReactNode, useMemo, useState } from "react";
import { ReadMore } from "./Readmore";
import { Trash } from "lucide-react";

type Props = {
   list: Listing[];
   onDelete: (index: number) => void;
};

export const Results = ({ list, onDelete }: Props) => {
   // state 
   const [sorted, setSorted] = useState<keyof Listing>('pricePerSqm');

   // TODO: think about this ... const allFeatures = [...new Set(...list.map((item) => item.features))];

   const sortedList = useMemo(() => {
      return list.toSorted((a: Listing, b: Listing) => {
         const src = a[sorted];
         const dest = b[sorted];

         // numeric?
         if (['pricePerSqm', 'price', 'sqm', 'rooms'].includes(sorted)) {
            if (typeof src === 'string' && typeof dest === 'string') {
               return parseFloat(src) - parseFloat(dest);
            }
         } else {
            if (typeof src === 'string' && typeof dest === 'string') {
               return src.localeCompare(dest);
            }
         }
         return 0;

      });
   }, [sorted, list]);

   function renderRow(label: string, render: (item: Listing, index: number) => ReactNode) {
      return (
         <tr key={label}>
            <td className="font-bold border-b border-gray-200 p-2 text-xs align-top">{!label.startsWith('_') && label}</td>
            {
               sortedList.map((item: Listing, index: number) => (<td className="border-b border-gray-200 p-2 align-top min-w-[20vw]" key={`${label}-${index}`}>{render(item, index)}</td>))
            }
         </tr>
      )
   }

   function _text(attr: keyof Listing, suffix: string = '') {
      return function (item: Listing) {
         const v = item[attr] || ''
         if (!v || v.length === 0) {
            return '---'
         }
         return <ReadMore text={v + ' ' + suffix} />;
      }
   }

   function _features(item: Listing) {
      return (<div className="flex flex-col items-start gap-0.5">
         {
            item.features.map((val: string) => (
               <div key={val} className="bg-black text-white rounded-full px-2 py-1 text-xs">{val}</div>
            ))
         }
      </div>);
   }

   function _title(item: Listing) {
      return (<strong>{item.title}</strong>)
   }

   function _action(item: Listing, index: number) {
      return (<button type="button" className="cursor-pointer" onClick={() => onDelete(index)}>
         <Trash className="text-red-600 w-4 h-4" />
      </button>);
   }

   function _image(item: Listing) {
      return (<img src={item.image} alt="compare:image" className="w-full h-52 object-cover rounded-xl" />)
   }

   if (list.length === 0) {
      return null;
   }

   return (
      <>
         <div className="flex justify-start gap-1 items-center mb-4">
            <span className="text-primary">Sortieren nach</span>
            <select className="font-bold cursor-pointer" name="filter" id="filter" value={sorted} onChange={(e) => setSorted(e.target.value as keyof Listing)}>
               <option value="pricePerSqm">Preis pro Quadratmeter</option>
               <option value="price">Preis</option>
               <option value="sqm">Quadratmeter</option>
               <option value="rooms">Anzahl Räume</option>
            </select>
         </div>
         <div className="overflow-x-auto max-w-full">
            <table className="min-w-full border-collapse pb-4">
               <tbody>
                  {renderRow('_image', _image)}
                  {renderRow('_what', _title)}
                  {renderRow('Standort', _text('location'))}
                  {renderRow('Beschreibung', _text('description'))}
                  {renderRow('Preis', _text('price'))}
                  {renderRow('Fläche', _text('sqm'))}
                  {renderRow('Räume', _text('rooms'))}
                  {renderRow('Kontakt', _text('contact'))}
                  {renderRow('Features', _features)}
                  {renderRow('Quad. Preis', _text('pricePerSqm'))}
                  {renderRow('Aktion', _action)}
               </tbody>
            </table>
         </div>
      </>
   );
}