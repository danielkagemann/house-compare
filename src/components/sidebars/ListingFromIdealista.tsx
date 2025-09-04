"use client";

import { Listing } from "@/model/Listing";
import { parseHtml } from "@/utils/parse";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

export type ListDetails = {
   html: string;
   url: string;
};

type Props = {
   onChange: (data: Listing | null) => void
};

export const ListingFromIdealista = ({ onChange }: Props) => {
   // states
   const [data, setData] = useState<ListDetails>({ html: '', url: '' });
   const [loading, setLoading] = useState<boolean>(false);

   const handleOpenUrl = () => {
      if (data.url.trim().length === 0) {
         return;
      }
      window.open(data.url, "_blank", "width=800,height=600,left=200,top=150,resizable=yes,scrollbars=yes,popup");
   };

   /**
   * parse the source and fill listing
   * @returns 
   */
   const onFinished = async () => {
      setLoading(true);
      const listing = parseHtml(data.html);
      if (listing !== null) {
         listing.url = data.url;
         onChange(listing);
      }
      setLoading(false);
   };

   return (
      <>
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
            {loading && <span>Wird hinzugefügt...</span>}
            {!loading && <button type="button" onClick={onFinished} className="bg-primary text-white px-2 py-1 cursor-pointer rounded">Hinzufügen</button>}
         </div>
      </>
   );
}