import { Listing } from "@/model/Listing";
import { ReactNode } from "react";
import { ReadMore } from "./Readmore";

type Props = {
   list: Listing[]
};

export const Results = ({ list }: Props) => {
   function renderRow(label: string, render: (item: Listing) => ReactNode) {
      const reduced = list.slice(0, 3);
      return (
         <tr key={label}>
            <td className="font-bold border-b border-gray-200 p-2 text-xs align-top">{!label.startsWith('_') && label}</td>
            {
               reduced.map((item: Listing, index: number) => (<td className={`border-b border-gray-200 p-2 align-top ${reduced.length === 1 ? 'w-full' : reduced.length === 2 ? 'w-1/2' : 'w-1/3'}`} key={`${label}-${index}`}>{render(item)}</td>))
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

   function _title(item: Listing) {
      return (<strong>{item.title}</strong>)
   }

   function _image(item: Listing) {
      return (<img src={item.image} alt="compare:image" className="w-full h-52 object-cover rounded-xl" />)
   }

   if (list.length === 0) {
      return null;
   }

   return (
      <table className="table-auto w-full border-collapse pb-4">
         <tbody>
            {renderRow('_image', _image)}
            {renderRow('_what', _title)}
            {renderRow('Standort', _text('location'))}
            {renderRow('Beschreibung', _text('description'))}
            {renderRow('Preis', _text('price'))}
            {renderRow('Fläche', _text('sqm'))}
            {renderRow('Räume', _text('rooms'))}
            {renderRow('Kontakt', _text('contact'))}
            {renderRow('Quad. Preis', _text('pricePerSqm'))}
         </tbody>
      </table>
   );
}