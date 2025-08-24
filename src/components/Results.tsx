import { Listing } from "@/model/Listing";
import { ReactNode, useMemo, useState } from "react";
import { ReadMore } from "./Readmore";
import { MapPinned, Trash } from "lucide-react";

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
               sortedList.map((item: Listing, index: number) => (<td className="border-b border-gray-200 p-2 align-top w-1/3" key={`${label}-${index}`}>{render(item, index)}</td>))
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

   function _location(item: Listing) {
      return (
         <div className="flex gap-1 items-center">
            <a href={`https://www.google.de/maps/search/${encodeURIComponent(item.location)}`} target="_blank">
               <MapPinned className="cursor-pointer w-4 h-4" />
            </a>
            <span>{item.location}</span>
         </div>
      )
   }

   function _features(item: Listing, index: number) {
      // get other features translated to only string array and remove this one
      const otherFeatures = [...list].map((item) => item.features);
      const flatList = otherFeatures.splice(index, 1).flat();

      // get the features NOT in otherFeatures
      const highlight = item.features.filter((feature: string) => !flatList.includes(feature));

      return (<div className="flex flex-col items-start gap-0.5">
         {
            item.features.map((val: string) => (
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

   function _link(item: Listing) {
      return (<a className="underline text-primary text-md" href={item.url} target="_blank">{item.url}</a>)
   }

   function _action(item: Listing, index: number) {
      return (<button type="button" className="cursor-pointer" onClick={() => onDelete(index)}>
         <Trash className="text-red-600 w-4 h-4" />
      </button>);
   }

   function _image(item: Listing) {
      return (<img src={item.image} alt="compare:image" className="w-full h-52 object-cover rounded-xl" />)
   }

   return (
      <>
         {list.length > 1 &&
            <div className="flex justify-start gap-1 items-center mb-4">
               <span className="text-primary">Sortieren nach</span>
               <select className="font-bold cursor-pointer" name="filter" id="filter" value={sorted} onChange={(e) => setSorted(e.target.value as keyof Listing)}>
                  <option value="pricePerSqm">Preis pro Quadratmeter</option>
                  <option value="price">Preis</option>
                  <option value="sqm">Quadratmeter</option>
                  <option value="rooms">Anzahl Räume</option>
               </select>
            </div>}

         <table className="w-full border-collapse pb-4">
            <tbody>
               {renderRow('_image', _image)}
               {renderRow('URL', _link)}
               {renderRow('_what', _title)}
               {renderRow('Aktion', _action)}
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