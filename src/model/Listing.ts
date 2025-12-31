export type Coordinates = {
   lat: number;
   lon: number;
};

export const Ranking = {
   none: 0,
   interested: 1,
   favorite: 2,
   visited: 3,
   pricewatch: 4,
} as const;

export type RankingType = (typeof Ranking)[keyof typeof Ranking];

export type POI = {
   name: string;
   type: string;
   coordinates: Coordinates;
};

export type Location = Coordinates & {
   country: string;
   code: string;
   display: string;
   poi?: POI[];
};

export type Listing = {
   uuid: string;
   userId: number;
   creationdate: string;
   url: string;
   title: string;
   location: Location;
   price: string;
   sqm: string;
   rooms: string;
   image: string;
   description: string;
   contact: string;
   year: string;
   features: string[];
   notes: string;
   rank: RankingType;
};

export const LISTING_AVAILABLE_ATTRIBUTES = [
   'image',
   'title',
   'location',
   'year',
   'description',
   'price',
   'sqm',
   'rooms',
   'features',
   'contact',
];

export function getSquareMeterPrice(price: string, sqm: string, asNumber: boolean = false): string | number {
   const priceNum = Number.parseFloat(price.replace(/\./g, '').replace(',', '.'));
   const sqmNum = Number.parseFloat(sqm.replace(/\./g, '').replace(',', '.'));
   if (!Number.isNaN(priceNum) && !Number.isNaN(sqmNum) && sqmNum > 0) {
      const pricePerSqm = Math.round(priceNum / sqmNum);
      return asNumber ? pricePerSqm : `EUR ${pricePerSqm.toLocaleString()}`;
   }
   return asNumber ? 0 : '--';
}

export function distanceBetweenCoordinates(from: Coordinates, to: Coordinates) {
   const R = 6371;
   const toRad = (deg: number) => (deg * Math.PI) / 180;

   const dLat = toRad(to.lat - from.lat);
   const dLon = toRad(to.lon - from.lon);

   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   return R * c; // result in km
}

export function amenityTitle(type: string) {
   switch (type) {
      case 'supermarket':
         return 'Supermärkte';
      case 'restaurant':
         return 'Restaurants';
      case 'beach':
      case 'beach_resort':
         return 'Strände';
      default:
         return type;
   }
}
