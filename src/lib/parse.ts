import { Listing } from '@/model/Listing';

type OmitListing = Omit<Listing, 'userId' | 'url'>;

/**
 * parsing idealista
 * @param doc
 * @returns
 */
function parseIdealista(doc: Document): OmitListing | null {
   const title = doc.querySelector('.main-info__title-main')?.textContent?.trim() || '';
   const location = doc.querySelector('.main-info__title-minor')?.textContent?.trim() || '';
   const price = doc.querySelector('.info-data-price')?.textContent?.trim() || '';

   const sqm =
      Array.from(doc.querySelectorAll('.info-features span'))
         .find((el) => el.textContent?.includes('m²'))
         ?.textContent?.trim() || '';

   const rooms =
      Array.from(doc.querySelectorAll('.info-features span'))
         .find((el) => el.textContent?.toLowerCase().includes('schlaf'))
         ?.textContent?.trim() || '';

   const image = doc.querySelector('.first-image img')?.getAttribute('src') || '';
   const description = doc.querySelector('.comment')?.textContent?.trim() || '';
   const contact = doc.querySelector('.advertiser-name-container')?.textContent?.trim() || '';

   const features: string[] = [];
   let year = '';

   const sections = Array.from(doc.querySelectorAll('.details-property_features')).slice(0, -1);

   sections.forEach((section) => {
      Array.from(section.querySelectorAll('li')).forEach((li) => {
         const value = li.textContent?.trim() || '';
         if (value.toLowerCase().startsWith('baujahr')) {
            const match = value.match(/\d+/);
            if (match) year = match[0];
         } else {
            features.push(value);
         }
      });
   });

   const uuid = Date.now().toString();

   return {
      uuid,
      title,
      location: { lat: 0, lon: 0, country: '', code: '', display: location },
      price: Number.parseFloat(price.replace(/[^\d]/g, '')).toString(),
      sqm: Number.parseFloat(sqm.replace(/[^\d]/g, '')).toString(),
      rooms: Number.parseFloat(rooms.replace(/[^\d]/g, '')).toString(),
      image,
      description,
      contact,
      features,
      year,
      notes: '',
      creationdate: Date.now().toString(),
      rank: 0,
   };
}

/**
 * parse data from thinkSpain
 * @param doc
 * @returns
 */
function parseThinkSpain(doc: Document): OmitListing | null {
   const title = doc.querySelector('.description h1.h1')?.textContent?.trim() || '';

   const detailList = Array.from(doc.querySelectorAll('.detail-list li'));

   const price = detailList.at(0)?.textContent?.replace(/€/g, '')?.trim() || '';
   const sqm = detailList.at(1)?.textContent?.replace(/m2/g, '')?.trim() || '';
   const rooms = detailList.at(2)?.textContent?.trim() || '';

   let location = doc.querySelector('.locationProximity')?.textContent?.trim() || '';

   // location can be detected better
   const mapElement = doc.querySelector('#map');

   if (mapElement) {
      const lat = mapElement.getAttribute('data-lat');
      const lng = mapElement.getAttribute('data-lng');
      if (lat && lng) {
         location = `(${lat},${lng})`;
      }
   }

   const description = doc.querySelector('.property-description')?.textContent?.trim() || '';

   const image = doc.querySelector('.glide__slide-inner img')?.getAttribute('src') || '';
   const contact = 'thinkspain';

   const features: string[] = [];

   Array.from(doc.querySelectorAll('.tags__item')).forEach((li) => {
      const value = li.textContent?.trim() || '';
      features.push(value);
   });

   const year = doc.querySelector('.yearbuilt- .bold')?.textContent?.trim() || '';

   const uuid = Date.now().toString();

   return {
      uuid,
      title,
      location: { lat: 0, lon: 0, country: '', code: '', display: location },
      price: Number.parseFloat(price.replace(/[^\d]/g, '')).toString(),
      sqm: Number.parseFloat(sqm.replace(/[^\d]/g, '')).toString(),
      rooms: Number.parseFloat(rooms.replace(/[^\d]/g, '')).toString(),
      image,
      description,
      contact,
      features,
      year,
      notes: '',
      creationdate: Date.now().toString(),
      rank: 0,
   };
}

export type Website = 'idealista' | 'thinkspain';

export function parseHtml(html: string, website: Website = 'idealista'): OmitListing | null {
   if (!html) {
      return null;
   }

   const parser = new DOMParser();
   const doc = parser.parseFromString(html, 'text/html');

   if (website === 'idealista') {
      return parseIdealista(doc);
   } else if (website === 'thinkspain') {
      return parseThinkSpain(doc);
   }

   return null;
}
