import { Listing } from "@/model/Listing";
import { parseHtml } from "@/lib/parse";
import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
   onChange: (listing: Listing) => void;
}

export const InputSourceCode = ({ onChange }: Props) => {
   const [data, setData] = useState<string>('');
   const [error, setError] = useState<string>('');

   function onSourcecodeChange() {
      const parsed = parseHtml(data);
      setError('');
      if (parsed) {
         onChange({ ...parsed });
      } else {
         setError('Informationen der Immobilie konnte nicht ermittelt werden.');
      }
   }

   return (
      <div>
         Hier kannst Du den HTML Quellcode der Immobilienseite einfügen. Aktuell kann nur von idealista extrahiert werden.
         <textarea
            rows={3}
            className="w-full p-2 border rounded-md mt-2"
            placeholder="Füge hier den HTML Quellcode der Seite ein..."
            value={data}
            onChange={(e) => {
               setData(e.target.value);
               setError('');
            }}
         />
         {error.length > 0 && <p className="text-red-700 font-sm">{error}</p>}
         <div className="flex justify-end"><Button onClick={onSourcecodeChange}>Weiter</Button></div>
      </div>
   );
}