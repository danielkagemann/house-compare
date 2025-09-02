import { Listing, LISTING_AVAILABLE_ATTRIBUTES, listingAttributeToText } from "@/model/Listing";
import { ReactNode, useMemo, useState } from "react";
import { ReadMore } from "./Readmore";
import { ExternalLink, MapPinned, Trash } from "lucide-react";
import { FilterList } from "./FilterList";
import { Tooltip } from "./Tooltip";

type Props = {
   list: Listing[];
   onDelete: (id: string) => void;
};

const CELL_WIDTH = "min-w-[25vw]";

export const Results = ({ list, onDelete }: Props) => {
   // state 
   const [sorted, setSorted] = useState<keyof Listing>('pricePerSqm');
   const [attributes, setAttributes] = useState<string[]>(LISTING_AVAILABLE_ATTRIBUTES);

   /**
    * sort list and also filter
    */
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

   /**
    * render one row of the table
    * @param label 
    * @param render 
    * @returns 
    */
   function renderRow(label: string, render: (item: Listing, index: number) => ReactNode) {
      return (
         <tr key={label}>
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
         <div className="flex gap-1 items-center">
            {
               item.location &&
               <a href={`https://www.google.de/maps/search/${encodeURIComponent(item.location)}`} target="_blank">
                  <MapPinned className="cursor-pointer w-4 h-4" />
               </a>
            }
            <span>{item.location}</span>
         </div>
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
      return (
         <div className="flex gap-1 items-center">
            {
               item.url &&
               <a className="text-primary cursor-pointer" href={item.url} target="_blank">
                  <Tooltip text="Zur Originalseite">
                     <ExternalLink className="w-4 h-4" />
                  </Tooltip>
               </a>
            }
            <strong>{item.title}</strong>
         </div>
      )
   }

   function _action(item: Listing) {
      return (<div className="flex gap-2 justify-center">
         {
            item.uuid &&
            <button type="button" className="cursor-pointer" onClick={() => onDelete(item.uuid)}>
               <Tooltip text="Immobilie löschen">
                  <Trash className="text-red-600 w-4 h-4" />
               </Tooltip>
            </button>
         }
      </div >);
   }

   function _image(item: Listing) {
      return (<img src={item.image} alt="compare:image" className="w-[25vw] h-52 object-cover rounded-xl" />)
   }

   return (
      <>
         <div className="flex justify-end gap-1 items-center mb-4">
            <FilterList list={LISTING_AVAILABLE_ATTRIBUTES} selected={attributes} onChange={setAttributes} />

            <select className="cursor-pointer border-1 rounded-sm border-gray-400 p-2 text-md" name="filter" id="filter" value={sorted} onChange={(e) => setSorted(e.target.value as keyof Listing)}>
               <option value="pricePerSqm">Preis pro Quadratmeter</option>
               <option value="price">Preis</option>
               <option value="sqm">Quadratmeter</option>
               <option value="rooms">Anzahl Räume</option>
               <option value="year">Baujahr</option>
            </select>
         </div>

         <div className="overflow-x-auto block shadow-xl border-1 border-gray-300 rounded-xl bg-white p-4">
            <table className="min-w-full border-collapse">
               <tbody>
                  {renderRow('_actions', _action)}
                  {attributes.includes('image') && renderRow('_image', _image)}
                  {attributes.includes('title') && renderRow('_what', _title)}
                  {attributes.includes('location') && renderRow(listingAttributeToText('location'), _location)}
                  {attributes.includes('year') && renderRow(listingAttributeToText('year'), _text('year', 'gebaut'))}
                  {attributes.includes('description') && renderRow(listingAttributeToText('description'), _text('description'))}
                  {attributes.includes('price') && renderRow(listingAttributeToText('price'), _text('price', 'EUR'))}
                  {attributes.includes('sqm') && renderRow(listingAttributeToText('sqm'), _text('sqm', 'm2 Wohnfläche'))}
                  {attributes.includes('pricePerSqm') && renderRow(listingAttributeToText('pricePerSqm'), _text('pricePerSqm', 'EUR pro m2'))}
                  {attributes.includes('rooms') && renderRow(listingAttributeToText('rooms'), _text('rooms', 'Schlafz.'))}
                  {attributes.includes('features') && renderRow(listingAttributeToText('features'), _features)}
                  {attributes.includes('contact') && renderRow(listingAttributeToText('contact'), _text('contact'))}
               </tbody>
            </table>
         </div>
      </>
   );
}