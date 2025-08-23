"use client";

import { useState } from "react";

type Props = {
   onChange: (html: string | null) => void
};

export const SidebarSourcecode = ({ onChange }: Props) => {
   // states
   const [html, setHtml] = useState("");

   return (
      <div className="bg-black/50 z-50 inset-0 fixed">
         <div className="absolute right-0 top-0 bottom-0 bg-white p-4 w-1/2">
            <h2 className="text-xl font-bold">Daten hinzufügen...</h2>

            <p className="text-gray-500 text-sm">Die Webseitenbetreiber gehen stark gegen webcrawling vor und erschweren somit das automatische beziehen von Informationen. Damit wir dennoch den Vergleich machen können, gehe auf die Seite des Hauses von Idealista und lass dir den Quelltext anzeigen. Diesen fügst Du dann hier ein.</p>

            <textarea rows={20}
               className="border-1 w-full bg-gray-50 p-1 border-gray-500"
               onChange={(e) => setHtml(e.target.value)}
               placeholder="Füge hier den HTML-Quelltext von Idealista ein..."
               value={html} />

            <div className="flex justify-between">
               <button type="button" onClick={() => onChange(null)} className="bg-transparent text-primary cursor-pointer">Abbrechen</button>
               <button type="button" onClick={() => onChange(html)} className="bg-primary text-white px-2 py-1 cursor-pointer">Hinzufügen</button>
            </div>
         </div>
      </div>
   );
}