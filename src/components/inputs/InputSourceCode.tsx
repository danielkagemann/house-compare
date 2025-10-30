import { Listing } from "@/model/Listing";
import { parseHtml } from "@/lib/parse";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Endpoints } from "@/lib/fetch";

interface Props {
   onChange: (listing: Listing) => void;
}

export const InputSourceCode = ({ onChange }: Props) => {
   const [data, setData] = useState<string>('');
   const [error, setError] = useState<string>('');

   async function onSourcecodeChange() {
      const parsed = parseHtml(data);
      setError('');
      if (parsed) {

         // we need to adjust the image and the location
         if (parsed.image) {
            const base64 = await Endpoints.imageProxy(parsed.image);
            parsed.image = base64;
         }

         if (parsed.location.display.length > 0) {
            const loc = await Endpoints.locationLookup(parsed.location.display);
            if (loc) {
               parsed.location = loc;
            }
         }

         onChange({ ...parsed });
      } else {
         setError('Informationen der Immobilie konnte nicht ermittelt werden.');
      }
   }

   return (
      <div className="max-w-full">
         Hier kannst Du den HTML Quellcode der Immobilienseite einfügen. Aktuell kann nur von idealista extrahiert werden.
         <Textarea
            className="h-16 resize-none overflow-auto"
            rows={3}
            placeholder="Füge hier den HTML Quellcode der Seite ein..."
            value={data}
            onChange={(e) => {
               setData(e.target.value);
               setError('');
            }}
         />
         {error.length > 0 && <p className="text-red-700 font-sm">{error}</p>}
         <div className="flex justify-end"><Button onClick={onSourcecodeChange}>Überprüfen</Button></div>
      </div>
   );
}