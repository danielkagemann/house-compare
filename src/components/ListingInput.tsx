import { BedDouble, Calendar, Euro, ImageUp, Leaf, Link, MapPin, MessageSquareMore, RulerDimensionLine, Tag, User } from "lucide-react";
import { ReactElement, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Listing } from "@/model/Listing";

type Layout = {
   attr: string;
   label: string;
   icon: ReactElement;
   field: 'input' | 'area' | 'readonly' | 'features';
};

interface ListingInputProps {
   data: Listing;
   onChange: (data: Listing) => void;
}

export const ListingInput = ({ data, onChange }: ListingInputProps) => {
   const [currentIndex, setCurrentIndex] = useState(0);

   const attributes: Layout[] = [
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

   const computedPricePerSqm = useMemo(() => {
      const price = Number(data.price);
      const sqm = Number(data.sqm);
      if (!price || !sqm) {
         return '';
      }
      const value = Math.round(price / sqm);
      return Number.isFinite(value) ? value.toString() : '';
   }, [data.price, data.sqm]);

   const renderCurrent = () => {
      const element = attributes[currentIndex];

      const value = element.attr === 'pricePerSqm' ? computedPricePerSqm : data[element.attr as keyof Listing];

      return (
         <>
            <div className="flex gap-1 items-center">
               <div className="bg-gray-200 p-2 rounded-full inline-flex">
                  {element.icon}
               </div>
               <label className={"text-primary text-sm"} htmlFor={element.attr}>{element.label}</label>
            </div>
            <input className="p-1.5 border rounded-md" name={element.attr} placeholder="" type="text" value={value as string} onChange={(e) => onChange({ ...data, [element.attr]: e.target.value })} />
            <div className="flex justify-end">
               <Button variant="outline" onClick={() => setCurrentIndex((currentIndex + 1) % attributes.length)}>Weiter</Button>
            </div>
         </>
      );
   };

   return (
      <div className="w-full">
         <Button variant="outline" onClick={() => setCurrentIndex((currentIndex - 1 + attributes.length) % attributes.length)}>Zurück</Button>
         {renderCurrent()}
      </div>
   );
}