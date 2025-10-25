"use client";

import { ListingPreview } from "@/components/ListingPreview";
import { Button } from "@/components/ui/button";
import { Listing } from "@/model/Listing";
import React, { useState } from "react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useStorage } from "@/hooks/storage-provider";


type InputOrder = {
   title: string;
   attr: string;
   children: React.ReactNode;
};


export default function AddPage() {
   // state
   const [current, setCurrent] = useState<string>('url');
   const [listing, setListing] = useState<Listing>({
      uuid: Date.now().toString(),
      url: '',
      title: '',
      location: '',
      price: '',
      sqm: '',
      pricePerSqm: '',
      rooms: '',
      image: '',
      description: '',
      contact: '',
      year: '',
      features: []
   });

   // hooks
   const $save = useStorage();
   const $router = useRouter();

   const onUpdateListing = (attr: string, next: string) => (value: string) => {
      setListing((prev) => ({ ...prev, [attr]: value }));
      setCurrent(next);
   };

   // locals
   const order: InputOrder[] = [
      { title: 'Link zur Webseite', attr: 'url', children: <InputLink value={listing.url} onChange={onUpdateListing('url', 'sourcecode')} /> },
      { title: 'Quelltext', attr: 'sourcecode', children: <InputSourceCode onChange={(v) => { setListing({ ...listing, ...v }); setCurrent('title') }} /> },
      { title: 'Titel', attr: 'title', children: <InputText value={listing.title} onChange={onUpdateListing('title', 'location')} /> },
      { title: 'Standort', attr: 'location', children: <InputLocation value={listing.location} onChange={(value, coords) => { setListing({ ...listing, location: value, coordinates: coords || undefined }); setCurrent('image') }} /> },
      { title: 'Link zum Bild', attr: 'image', children: <InputImage value={listing.image} onChange={onUpdateListing('image', 'price')} /> },
      { title: 'Preis', attr: 'price', children: <InputText description="Preis der Immobilie" value={listing.price} onChange={onUpdateListing('price', 'sqm')} /> },
      { title: 'Wohnfläche', attr: 'sqm', children: <InputSize price={listing.price} value={listing.sqm} onChange={(v, p) => { setListing({ ...listing, sqm: v, pricePerSqm: p }); setCurrent('rooms') }} /> },
      { title: 'Schlafzimmer', attr: 'rooms', children: <InputText description="Anzahl der Schlafzimmer" value={listing.rooms} onChange={onUpdateListing('rooms', 'description')} /> },
      { title: 'Beschreibung', attr: 'description', children: <InputText type="area" description="Beschreibung der Immobilie" value={listing.description} onChange={onUpdateListing('description', 'year')} /> },
      { title: 'Baujahr', attr: 'year', children: <InputText description="Baujahr der Immobilie" value={listing.year} onChange={onUpdateListing('year', 'features')} /> },
      { title: 'Eigenschaften', attr: 'features', children: <InputFeatures value={listing.features} onChange={(value) => { setListing({ ...listing, features: value }); setCurrent('contact'); }} /> },
      { title: 'Makler & Agentur', attr: 'contact', children: <InputText description="Von welcher Agentur/Makler wird die Immobilie angeboten?" value={listing.contact} onChange={onUpdateListing('contact', 'year')} /> },
   ];

   function onSave() {
      $save.listingAdd(listing);
      toast.success('Immobilie gespeichert!');
      $router.push('/');
   }

   return (
      <div className="min-h-screen grid grid-cols-[1fr_40%]">
         {/*user input*/}
         <div className="p-4">
            <h2 className="font-bold text-lg">Neue Immobilie hinzufügen</h2>

            <Accordion
               type="single"
               collapsible
               className="w-full"
               value={current}
               onValueChange={setCurrent}
            >
               {
                  order.map((item: InputOrder) => (
                     <AccordionItem value={item.attr} key={item.attr} className={item.attr === current ? 'bg-gray-100 border-l-2 border-gray-700' : 'transparent'}>
                        <AccordionTrigger className={`py-2 px-1 ${item.attr === current ? 'font-bold text-primary' : 'font-normal'}`}>{item.title}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-1 text-balance p-2">{item.children}</AccordionContent>
                     </AccordionItem>
                  ))
               }
            </Accordion>
            <div className="flex flex-col gap-1">
               <strong>Speichern</strong>
               <p>Wenn alle Informationen korrekt sind, dann klicke auf "Speichern"</p>
               <div className="flex justify-end">
                  <Button onClick={onSave}>Speichern</Button>
               </div>

            </div>
         </div>

         {/*preview*/}
         <ListingPreview data={listing} />
      </div>
   );
};
