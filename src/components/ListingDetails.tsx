"use client";

import { ListingPreview } from "@/components/ListingPreview";
import { Button } from "@/components/ui/button";
import { Listing, Ranking } from "@/model/Listing";
import React, { ReactNode, useEffect, useState } from "react";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"
import { InputLink } from "@/components/inputs/InputLink";
import { InputSourceCode } from "@/components/inputs/InputSourceCode";
import { InputText } from "@/components/inputs/InputText";
import { InputLocation } from "@/components/inputs/InputLocation";
import { InputImage } from "@/components/inputs/InputImage";
import { InputSize } from "@/components/inputs/InputSize";
import { InputFeatures } from "@/components/inputs/InputFeatures";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetPropertyDetails, useSetProperty } from "@/lib/fetch";
import { Asterisk, Check } from "lucide-react";
import { InputRank } from "./inputs/InputRank";
import { useTranslations } from "next-intl";
import { NavigationBar } from "./layout/NavigationBar";
import { Footer } from "./layout/Footer";

type InputOrder = {
   title: string;
   attr: string;
   children: React.ReactNode;
};

export const ListingDetails = () => {
   // hooks
   const $router = useRouter();
   const $url = useSearchParams();
   const t = useTranslations("house");

   // state
   const [current, setCurrent] = useState<string>('url');
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [listing, setListing] = useState<Omit<Listing, "userId">>({
      uuid: Date.now().toString(),
      url: '',
      creationdate: Date.now().toString(),
      notes: '',
      title: '',
      location: { lat: 0, lon: 0, country: '', code: '', display: '' },
      price: '',
      sqm: '',
      rooms: '',
      image: '',
      description: '',
      contact: '',
      year: '',
      features: [],
      rank: Ranking.none,
   });

   // queries
   const { data } = useGetPropertyDetails($url.get('id'));
   const $saveProperty = useSetProperty();

   useEffect(() => {
      if (data) {
         setIsEditing(true);
         setListing({ ...data });
      }
   }, [data])

   /**
  * updating value for given attribute
  * @param attr 
  * @returns 
  */
   const onUpdateListing = (attr: string) => (value: any) => {
      setListing((prev) => ({ ...prev, [attr]: value }));
   };

   /**
    * move to next field
    * @param next 
    * @returns 
    */
   const onNext = (next: string) => () => {
      setCurrent(next);
   };

   const isParsableUrl = () => {
      return listing.url.includes('idealista') || listing.url.includes('thinkspain');
   }

   // locals
   const order: InputOrder[] = [
      { title: t('linkToWebsite'), attr: 'url', children: <InputLink value={listing.url} onChange={onUpdateListing('url')} onNext={() => isParsableUrl() ? onNext('sourcecode')() : onNext('title')()} /> },
      { title: t('sourceCode'), attr: 'sourcecode', children: <InputSourceCode onChange={(v) => { setListing({ ...v, url: listing.url }); setCurrent('title') }} /> },
      { title: t('title'), attr: 'title', children: <InputText value={listing.title} onChange={onUpdateListing('title')} onNext={onNext('location')} /> },
      { title: t('location'), attr: 'location', children: <InputLocation value={listing.location} onChange={onUpdateListing('location')} onNext={onNext('image')} /> },
      { title: t('image'), attr: 'image', children: <InputImage value={listing.image} onChange={onUpdateListing('image')} onNext={onNext('price')} /> },
      { title: t('price'), attr: 'price', children: <InputText description={t("priceDescription")} value={listing.price} onChange={onUpdateListing('price')} onNext={onNext('sqm')} /> },
      { title: t('sqm'), attr: 'sqm', children: <InputSize price={listing.price} value={listing.sqm} onChange={onUpdateListing('sqm')} onNext={onNext('rooms')} /> },
      { title: t('rooms'), attr: 'rooms', children: <InputText description={t("roomsDescription")} value={listing.rooms} onChange={onUpdateListing('rooms')} onNext={onNext('description')} /> },
      { title: t('description'), attr: 'description', children: <InputText type="area" description={t("descriptionDescription")} value={listing.description} onChange={onUpdateListing('description')} onNext={onNext('year')} /> },
      { title: t('year'), attr: 'year', children: <InputText description={t("yearDescription")} value={listing.year} onChange={onUpdateListing('year')} onNext={onNext('features')} /> },
      { title: t('features'), attr: 'features', children: <InputFeatures value={listing.features} onChange={(value) => { setListing({ ...listing, features: value }); }} onNext={onNext('contact')} /> },
      { title: t('contact'), attr: 'contact', children: <InputText description={t("contactDescription")} value={listing.contact} onChange={onUpdateListing('contact')} onNext={onNext('notes')} /> },
      { title: t('notes'), attr: 'notes', children: <InputText type="area" description={t("notesDescription")} value={listing.notes} onChange={onUpdateListing('notes')} onNext={onNext('rank')} /> },
      { title: t('rank'), attr: 'rank', children: <InputRank value={listing.rank} onChange={onUpdateListing('rank')} onNext={onNext('')} /> },
   ];

   /**
    * save or update listing
    */
   async function onSave() {
      const res = await $saveProperty.mutateAsync(listing as Listing);

      if (!res) {
         return;
      }
      $router.push('/properties');
   }

   function renderMissingValue(attr: string): ReactNode {
      if (['sourcecode', 'notes', 'rank'].includes(attr)) {
         return null;
      }

      const value = (listing as any)[attr];

      const missing = <Asterisk size={10} className="inline-block ml-1 bg-red-800 text-white p-0.5 rounded-full" />;
      const filled = <Check size={10} className="inline-block ml-1 bg-green-800 text-white p-0.5 rounded-full" />;

      if (attr === 'location') {
         return (value.lat === 0 && value.lon === 0) ? missing : filled;
      }
      if (attr === 'features') {
         return (value.length === 0) ? missing : filled;
      }
      return (!value || value === '') ? missing : filled;
   }

   return (
      <div className="h-screen grid md:grid-cols-[80px_1fr_1fr] overflow-hidden">
         {/* navigation */}
         <NavigationBar />

         {/*user input*/}
         <div className="overflow-y-auto">
            <div className="p-4">
               <h1 className="font-semibold text-lg">{isEditing ? t('editImmo') : t('addImmo')}</h1>
               <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={current}
                  onValueChange={setCurrent}
               >
                  {
                     order.map((item: InputOrder) => (
                        <AccordionItem value={item.attr} key={item.attr} className={item.attr === current ? 'bg-gray-100 rounded-md border-0' : 'transparent'}>
                           <AccordionTrigger className={`p-2 ${item.attr === current ? 'font-bold text-primary' : 'font-normal'}`}>
                              <div className="flex justify-start gap-1 items-center">
                                 <div>{item.title}</div>
                                 <div>{renderMissingValue(item.attr)}</div>
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="flex flex-col gap-1 text-balance px-4">{item.children}</AccordionContent>
                        </AccordionItem>
                     ))
                  }
               </Accordion>
               <div className="flex flex-col gap-1 text-sm border-t border-gray-300 py-2">
                  <strong>{t('save')}</strong>
                  <p>Prüfe ob alle Eingaben korrekt sind. In der Vorschau siehst Du, zu wieviel Prozent alle Felder befüllt sind.</p>
                  <div className="flex justify-end">
                     <Button onClick={onSave}
                        disabled={listing.url === ''}>{isEditing ? t('update') : t('create')}</Button>
                  </div>
               </div>
            </div>
            <Footer />
         </div>

         {/*preview*/}
         <div className="hidden md:block">
            <ListingPreview data={listing as Listing} />
         </div>
      </div>
   );
}