"use client";

import { ExternalLink, SquareX } from "lucide-react";
import { useState } from "react";

export type ListDetails = {
   html: string;
   url: string;
};

type Props = {
   onChange: (data: ListDetails | null) => void
};

export const SidebarSourcecode = ({ onChange }: Props) => {
   // states
   const [data, setData] = useState<ListDetails>({ html: '', url: '' });

   const handleOpenUrl = () => {
      if (data.url.trim().length === 0) {
         return;
      }
      window.open(data.url, "_blank", "popup");
   };

   return (
      <div className="bg-black/50 z-50 inset-0 fixed">
         <div className="absolute right-0 top-0 bottom-0 bg-white p-8 w-1/2">
            <div className="flex justify-between gap-2">
               <h2 className="text-xl font-bold">Daten hinzufügen...</h2>
               <button type="button" onClick={() => onChange(null)}>
                  <SquareX className="w-5 h-5 cursor-pointer" />
               </button>
            </div>

            <p className="text-gray-500 text-sm py-2">URL eingeben</p>
            <div className="flex justify-between gap-1">
               <input type="text" value={data.url} onChange={(e) => setData({ ...data, url: e.target.value })} className="border-1 w-full bg-gray-50 p-1 border-gray-500" />
               <button type="button" onClick={handleOpenUrl}>
                  <ExternalLink className="cursor-pointer w-4 h-4" />
               </button>
            </div>

            <p className="text-gray-500 text-sm py-2">Die Webseitenbetreiber gehen stark gegen webcrawling vor und erschweren somit das automatische beziehen von Informationen. Damit wir dennoch den Vergleich machen können, gehe auf die Seite des Hauses von Idealista und lass dir den Quelltext anzeigen. Diesen fügst Du dann hier ein.</p>
            <textarea rows={10}
               className="border-1 w-full bg-gray-50 p-1 border-gray-500"
               onChange={(e) => setData({ ...data, html: e.target.value })}
               placeholder="Füge hier den HTML-Quelltext von Idealista ein..."
               value={data.html} />

            <div className="flex justify-end mt-4">
               <button type="button" onClick={() => onChange(data)} className="bg-primary text-white px-2 py-1 cursor-pointer rounded">Hinzufügen</button>
            </div>
         </div>
      </div>
   );
}