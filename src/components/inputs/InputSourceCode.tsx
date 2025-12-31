import { Listing } from "@/model/Listing";
import { parseHtml } from "@/lib/parse";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Endpoints } from "@/lib/fetch";
import { flushSync } from "react-dom";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";

interface Props {
   onChange: (listing: Listing) => void;
}

export const InputSourceCode = ({ onChange }: Props) => {
   const [data, setData] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [working, setWorking] = useState<boolean>(false);

   const t = useTranslations("input");

   async function onSourcecodeChange() {

      flushSync(() => {
         setWorking(true);
      });

      const website = data.includes("thinkspain") ? "thinkspain" : "idealista";

      const parsed = parseHtml(data, website);
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

               const poiResult = await Endpoints.locationPOI(loc.lat, loc.lon);
               if (poiResult) {
                  loc.poi = poiResult;
               }

               parsed.location = loc;
            }
         }
         onChange({ ...parsed as Listing });
      } else {
         setError(t("sourcecodeError"));
      }
      setWorking(false);
   }

   return (
      <div className="max-w-full">
         {t("sourcecodeDescription")}
         <Textarea
            className="h-16 resize-none overflow-auto"
            rows={3}
            autoFocus
            placeholder={t("pasteSourcecodeHere")}
            value={data}
            onChange={(e) => {
               setData(e.target.value);
               setError('');
            }}
         />
         {error.length > 0 && <p className="text-red-700 font-sm">{error}</p>}

         <div className="flex justify-end items-center">
            {working ? <Spinner /> : <Button variant="outline" onClick={onSourcecodeChange}>{t("check")}</Button>}
         </div>
      </div>
   );
}