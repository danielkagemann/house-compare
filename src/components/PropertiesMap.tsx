'use client';

import { Coordinates, distanceBetweenCoordinates, Listing, POI } from '@/model/Listing';
import { useMemo, useState } from 'react';
import { Link2 } from './animate-ui/icons/link-2';
import Link from 'next/link';
import { Map, MapMarker, MapRoute, MarkerContent, MarkerLabel, MarkerPopup, MarkerTooltip } from './ui/map';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { PartyPopper } from 'lucide-react';
import { RenderIf } from './renderif';
import { Endpoints } from '@/lib/fetch';
import { useStorage } from '@/store/storage';

interface Props {
   readonly listings: Listing[];
}

export default function PropertiesMap({ listings }: Props) {
   // hooks
   const t = useTranslations("house");
   const { location } = useStorage();

   // state
   const [selected, setSelected] = useState<Listing | null>(null);
   const [route, setRoute] = useState(null);

   /**
    * try to get route to destination
    * @param destination 
    */
   async function fetchRoute(destination: Coordinates) {
      const response = await Endpoints.routeLookup(selected!.location.lat, selected!.location.lon, destination.lat, destination.lon)
      if (response.routes?.[0]?.geometry?.coordinates) {
         setRoute(response.routes[0].geometry.coordinates);
      }
   }

   /**
    * render amenities on the map
    * @returns 
    */
   function renderAmenities() {
      if (!selected?.location.poi || selected.location.poi.length === 0) {
         return null;
      }

      return selected.location.poi.map((place: POI) => (
         <MapMarker
            key={place.name}
            latitude={place.coordinates.lat}
            longitude={place.coordinates.lon}>
            <MarkerContent>
               <div className="w-3 h-3 rounded-full bg-red-700 border-2 border-white shadow-lg z-10 transform -translate-x-1/2 -translate-y-1/2"
                  onClick={() => fetchRoute(place.coordinates)} />
               <MarkerTooltip>
                  <strong>{place.name}</strong>
                  <p>{distanceBetweenCoordinates(selected.location, place.coordinates).toFixed(1)} km {t('away')}</p>
               </MarkerTooltip>
            </MarkerContent>
         </MapMarker>
      ));
   }

   /**
    * render house data for popup or selection
    * @param item 
    * @param asPopup
    * @returns 
    */
   function renderHouseData(item: Listing, asPopup = false) {
      return (
         <div className={`flex flex-col gap-2 bg-white ${asPopup ? 'rounded-md shadow-lg' : ''}  overflow-hidden `}>
            {item.image && <img src={item.image} alt={item.title} className={`w-full h-30 object-cover overflow-hidden ${asPopup ? 'rounded-t-md' : ''}`} />}
            <div className="p-2">
               <div className="font-semibold text-lg">EUR {item.price}</div>
               <div>{item.title}</div>
               <RenderIf condition={asPopup}>
                  <div className="justify-between flex mt-2">
                     <Button variant="ghost" size="icon-sm" onClick={() => setSelected(item)}
                     >
                        <PartyPopper size={18} />
                     </Button>
                     <Link href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center rounded-md text-xs bg-secondary p-2 gap-1">
                        <Link2 size={18} /> Zur Webseite
                     </Link>
                  </div>
               </RenderIf>
            </div>
         </div>
      );
   }

   /**
    * add starting point as marker
    * @returns 
    */
   function renderStartingPoint() {
      if (!location) {
         return null;
      }

      return (
         <MapMarker latitude={location.lat} longitude={location.lon}>
            <MarkerContent>
               <MarkerLabel position="bottom">
                  <div className="bg-primary text-white py-1 px-2 border border-white/80 rounded-md">{location.display}</div>
               </MarkerLabel>
               <MarkerTooltip>{t('start')}</MarkerTooltip>
            </MarkerContent>
         </MapMarker>
      );
   }

   /**
    * create custom html marker
    * @param item 
    * @returns 
    */
   function renderCustomMarker(item: Listing) {
      return (
         <MapMarker
            key={item.title}
            latitude={item.location.lat}
            longitude={item.location.lon}>
            <MarkerContent>
               <MarkerLabel position="bottom">
                  <div className="bg-black/80 text-white py-1 px-2 border border-white/80 rounded-md">EUR {item.price.toString()}</div>
               </MarkerLabel>
            </MarkerContent>
            <MarkerPopup className="p-0 w-62">
               {renderHouseData(item, true)}
            </MarkerPopup>
         </MapMarker>
      );
   }

   // derived state
   const markerList = useMemo((): Listing[] => {
      return listings?.filter((item: Listing) => item.location.lat !== undefined && item.location.lon !== undefined)
         ?? [];
   }, [listings]);

   function renderMap() {
      if (selected) {
         return (
            <>
               <div className="absolute top-0 left-0 w-70">
                  {renderHouseData(selected)}
               </div>
               <button type="button"
                  className="bg-black text-white p-2 absolute left-0 top-0"
                  onClick={() => setSelected(null)}>
                  Zurück
               </button>

               <MapMarker latitude={selected.location.lat} longitude={selected.location.lon}>
                  <MarkerContent>
                     <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg z-10 transform -translate-x-1/2 -translate-y-1/2" />
                  </MarkerContent>
               </MapMarker>

               {renderAmenities()}
               {route && (
                  <MapRoute
                     coordinates={route}
                     color="#555"
                     width={3}
                     opacity={0.85}
                  />
               )}
            </>
         );
      }
      return listings.map(renderCustomMarker);
   }

   return (
      <Map center={[markerList.length > 0 ? markerList[0].location.lon : 0, markerList.length > 0 ? markerList[0].location.lat : 0]}
         zoom={11}
      >
         {renderStartingPoint()}
         {renderMap()}
      </Map>
   )
}
