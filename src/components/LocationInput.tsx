import { CircleX, MapPinHouse, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useStorage } from "@/store/storage";
import { Input } from "./ui/input";
import { flushSync } from "react-dom";
import { Spinner } from "./ui/spinner";
import { Tooltip } from "./ui/Tooltip";
import { Endpoints, useGetPropertyList } from "@/lib/fetch";
import { Loading } from "./Loading";
import { useTranslations } from "next-intl";

export const LocationInput = () => {
   // hooks
   const t = useTranslations("header");
   const $storage = useStorage();

   // states
   const [fromLocation, setFromLocation] = useState<string>($storage.location?.display ?? '');
   const [enterLocation, setEnterLocation] = useState<boolean>(false);
   const [working, setWorking] = useState<boolean>(false);

   const { data: listings, isLoading } = useGetPropertyList();

   if (isLoading) {
      return <Loading />;
   }

   if (listings.length === 0) {
      return null;
   }

   if (!enterLocation) {
      const hasLocation = fromLocation.length > 0;
      return (
         <Tooltip text={hasLocation ? fromLocation : t("startPointForDistance")}>
            <Button variant="secondary"
               onClick={() => setEnterLocation(true)}><MapPinHouse size={14} />
               {hasLocation ? fromLocation.substring(0, 15) : t("startPoint")}
            </Button>
         </Tooltip>
      );
   }

   async function onLocationCheck() {
      if (fromLocation.length === 0) {
         return;
      }

      flushSync(() => {
         setWorking(true);
      });

      const result = await Endpoints.locationLookup(fromLocation);

      if (!result) {
         $storage.locationSet(null);
         toast.error(t("errorNoCoordinatesFound"));
      } else {
         $storage.locationSet(result);
         setFromLocation(result.display);
         setEnterLocation(false);
      }
      setWorking(false);
   }

   return <div className="flex gap-1 items-center">
      <Input type="text"
         placeholder={t("enterLocation")}
         value={fromLocation}
         onChange={(e) => {
            setFromLocation(e.target.value);
         }} />
      {working ? <Spinner /> : (<>
         <Button variant="default"
            disabled={fromLocation.length === 0}
            onClick={onLocationCheck}>
            <Search size={14} />
         </Button>
         <Button variant="secondary" onClick={() => {
            setEnterLocation(false);
            setFromLocation('');
            $storage.locationSet(null);
         }}>
            <CircleX size={14} />
         </Button>
      </>)}
   </div >;
};