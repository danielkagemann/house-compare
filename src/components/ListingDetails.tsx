"use client";

import { ListingPreview } from "@/components/ListingPreview";
import { Button } from "@/components/ui/button";
import { Listing } from "@/model/Listing";
import React, { useEffect, useState } from "react";
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
import { Header } from "./layout/Header";
import { PageLayout } from "./PageLayout";

type InputOrder = {
   title: string;
   attr: string;
   children: React.ReactNode;
};

export const ListingDetails = () => {
   // hooks
   const $router = useRouter();
   const $url = useSearchParams();

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
      features: []
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
      { title: 'Link zur Webseite', attr: 'url', children: <InputLink value={listing.url} onChange={onUpdateListing('url')} onNext={() => isParsableUrl() ? onNext('sourcecode')() : onNext('title')()} /> },
      { title: 'Quelltext', attr: 'sourcecode', children: <InputSourceCode onChange={(v) => { setListing({ ...v, url: listing.url }); setCurrent('title') }} /> },
      { title: 'Titel', attr: 'title', children: <InputText value={listing.title} onChange={onUpdateListing('title')} onNext={onNext('location')} /> },
      { title: 'Standort', attr: 'location', children: <InputLocation value={listing.location} onChange={onUpdateListing('location')} onNext={onNext('image')} /> },
      { title: 'Bild', attr: 'image', children: <InputImage value={listing.image} onChange={onUpdateListing('image')} onNext={onNext('price')} /> },
      { title: 'Preis', attr: 'price', children: <InputText description="Preis der Immobilie" value={listing.price} onChange={onUpdateListing('price')} onNext={onNext('sqm')} /> },
      { title: 'Wohnfläche', attr: 'sqm', children: <InputSize price={listing.price} value={listing.sqm} onChange={onUpdateListing('sqm')} onNext={onNext('rooms')} /> },
      { title: 'Schlafzimmer', attr: 'rooms', children: <InputText description="Anzahl der Schlafzimmer" value={listing.rooms} onChange={onUpdateListing('rooms')} onNext={onNext('description')} /> },
      { title: 'Beschreibung', attr: 'description', children: <InputText type="area" description="Beschreibung der Immobilie" value={listing.description} onChange={onUpdateListing('description')} onNext={onNext('year')} /> },
      { title: 'Baujahr', attr: 'year', children: <InputText description="Baujahr der Immobilie" value={listing.year} onChange={onUpdateListing('year')} onNext={onNext('features')} /> },
      { title: 'Eigenschaften', attr: 'features', children: <InputFeatures value={listing.features} onChange={(value) => { setListing({ ...listing, features: value }); }} onNext={onNext('contact')} /> },
      { title: 'Makler & Agentur', attr: 'contact', children: <InputText description="Von welcher Agentur/Makler wird die Immobilie angeboten?" value={listing.contact} onChange={onUpdateListing('contact')} onNext={onNext('notes')} /> },
      { title: 'Notizen', attr: 'notes', children: <InputText type="area" description="Notizen zur Immobilie" value={listing.notes} onChange={onUpdateListing('notes')} onNext={onNext('')} /> },
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

   return (
      <PageLayout>
         <Header />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/*user input*/}
            <div className="px-4 md:px-0">
               <h2 className="font-bold text-lg">{isEditing ? 'Immobilie bearbeiten' : 'Neue Immobilie hinzufügen'}</h2>

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
                           <AccordionTrigger className={`p-2 ${item.attr === current ? 'font-bold text-primary' : 'font-normal'}`}>{item.title}</AccordionTrigger>
                           <AccordionContent className="flex flex-col gap-1 text-balance px-4">{item.children}</AccordionContent>
                        </AccordionItem>
                     ))
                  }
               </Accordion>
               <div className="flex flex-col gap-1 text-sm border-t-1 border-gray-300 py-2">
                  <strong>Speichern</strong>
                  <p>Prüfe ob alle Eingaben korrekt sind. In der Vorschau siehst Du, zu wieviel Prozent alle Felder befüllt sind.</p>
                  <div className="flex justify-end">
                     <Button onClick={onSave}>{isEditing ? 'Aktualisieren' : 'Erstellen'}</Button>
                  </div>

               </div>
            </div>

            {/*preview*/}
            <div className="hidden md:block">
               <ListingPreview data={listing as Listing} />
            </div>
         </div>
      </PageLayout>
   );
}