import { Listing } from "@/model/Listing";
import { ReactNode, useMemo, useState } from "react";
import { ReadMore } from "./Readmore";
import { ArrowLeft, ArrowRight, ExternalLink, MapPinned, Trash } from "lucide-react";

type Props = {
   list: Listing[];
   onDelete: (id: string) => void;
};

const MAX_ITEMS = 3;
const CELL_WIDTH = "w-1/3"

export const Results = ({ list, onDelete }: Props) => {
   // state 
   const [sorted, setSorted] = useState<keyof Listing>('pricePerSqm');
   const [from, setFrom] = useState<number>(0);

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
      }).slice(from, MAX_ITEMS);
   }, [sorted, list, from]);

   // do we have data?
   if (list.length === 0) {
      return <>
         <h2 className="font-bold text-lg">Herzlich Willkommen,</h2>
         <p className="text-gray-600 text-md mt-4">Dies ist eine kleine Anwendung, mit der Du Häuser von Idealista miteinander vergleichen kannst.
            Da die Daten nicht direkt von idealista ermittelt werden können, kmusst Du (leider) den Quelltext hinzufügen.
            <br />Alle hinzugefügten Immobilien werden gespeichert. Auch wenn Du die Seite verlässt und wieder kommst, kannst Du
            dort weitermachen, wo Du aufgehört hast. Füge so viele Immobilien hinzu wie Du möchtest.
         </p>
      </>;
   }

   function renderRow(label: string, render: (item: Listing, index: number) => ReactNode) {
      return (
         <tr key={label}>
            <td className="font-bold border-b border-gray-200 p-2 text-xs align-top">{!label.startsWith('_') && label}</td>
            {
               sortedList.map((item: Listing, index: number) => (<td className={`border-b border-gray-200 p-2 align-top ${CELL_WIDTH}`} key={`${label}-${index}`}>{render(item, index)}</td>))
            }
         </tr>
      )
   }

   function _text(attr: keyof Listing, suffix: string = '') {
      return function _internal(item: Listing) {
         const v = item[attr] || ''
         if (!v || v.length === 0) {
            return '---'
         }
         return <ReadMore text={v + ' ' + suffix} />;
      }
   }

   function _location(item: Listing) {
      return (
         <span>{item.location}</span>
      )
   }

   function _features(item: Listing, index: number) {
      // get other features translated to only string array and remove this one
      const tmp = [...sortedList];
      tmp.splice(index, 1);

      const flatList = tmp.map((item) => item?.features ?? []).flat();

      // get the features NOT in otherFeatures
      const highlight = (item?.features ?? []).filter((feature: string) => !flatList.includes(feature));

      return (<div className="flex flex-col items-start gap-0.5">
         {
            (item?.features ?? []).map((val: string) => (
               <div key={val}
                  className={`${highlight.includes(val) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} rounded-full px-2 py-1 text-xs`}>
                  {val}
               </div>
            ))
         }
      </div>);
   }

   function _title(item: Listing) {
      return (<strong>{item.title}</strong>)
   }

   function _action(item: Listing) {
      return (<div className="flex gap-2">
         <a className="text-primary cursor-pointer" title={item.url} href={item.url} target="_blank">
            < ExternalLink className="w-4 h-4" />
         </a >
         <a href={`https://www.google.de/maps/search/${encodeURIComponent(item.location)}`} target="_blank">
            <MapPinned className="cursor-pointer w-4 h-4" />
         </a>
         <button type="button" className="cursor-pointer" onClick={() => onDelete(item.uuid)}>
            <Trash className="text-red-600 w-4 h-4" />
         </button>
      </div >);
   }

   function _image(item: Listing) {
      return (<img src={item.image} alt="compare:image" className="w-full h-52 object-cover rounded-xl" />)
   }

   function renderButtons() {
      if (list.length <= MAX_ITEMS) {
         return null;
      }
      return (
         <div className="flex justify-between mb-4">
            <h2 className="font-bold text-lg">Insgesamt {list.length} - Sichtbar {from + 1} bis {Math.min(from + MAX_ITEMS, list.length)}</h2>
            <div className="flex justify-end gap-2">
               <button type="button" onClick={() => setFrom(p => Math.max(p - 1, 0))}>
                  <ArrowLeft className="w-4 h-4 cursor-pointer"></ArrowLeft>
               </button>
               <button type="button" onClick={() => setFrom(p => Math.min(p + 1, list.length - MAX_ITEMS))}>
                  <ArrowRight className="w-4 h-4 cursor-pointer"></ArrowRight>
               </button>
            </div>
         </div>
      );
   }

   return (
      <>
         {list.length > 1 &&
            <div className="flex justify-start gap-1 items-center mb-4">
               <span className="text-primary">Sortieren nach</span>
               <select className="font-bold cursor-pointer border-1 rounded-sm border-gray-400" name="filter" id="filter" value={sorted} onChange={(e) => setSorted(e.target.value as keyof Listing)}>
                  <option value="pricePerSqm">Preis pro Quadratmeter</option>
                  <option value="price">Preis</option>
                  <option value="sqm">Quadratmeter</option>
                  <option value="rooms">Anzahl Räume</option>
                  <option value="year">Baujahr</option>
               </select>
            </div>}

         {renderButtons()}

         <table className="w-full border-collapse pb-4">
            <tbody>
               {renderRow('_image', _image)}
               {renderRow('_actions', _action)}
               {renderRow('_what', _title)}
               {renderRow('Standort', _location)}
               {renderRow('Baujahr', _text('year'))}
               {renderRow('Beschreibung', _text('description'))}
               {renderRow('Preis', _text('price'))}
               {renderRow('Fläche', _text('sqm'))}
               {renderRow('Quad. Preis', _text('pricePerSqm'))}
               {renderRow('Räume', _text('rooms'))}
               {renderRow('Features', _features)}
               {renderRow('Kontakt', _text('contact'))}
            </tbody>
         </table>
      </>
   );
}