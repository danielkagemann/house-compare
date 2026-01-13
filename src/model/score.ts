import { Listing } from './Listing';

type Weights = {
   price: number;
   sqm: number;
   year: number;
   rooms: number;
};

const DEFAULT_WEIGHTS: Weights = {
   price: 0.3,
   sqm: 0.3,
   year: 0.1,
   rooms: 0.3,
};

export function calculateScores(properties: Listing[], weights: Weights = DEFAULT_WEIGHTS) {
   // check weights to make sure they sum to 1
   const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
   if (totalWeight !== 1) {
      throw new Error(`Weights must sum to 1. Current sum is ${totalWeight}`);
   }

   const minMax = <K extends keyof Listing>(key: K) => {
      const values = properties.map((p) => {
         const v = Number.parseFloat(p[key] as unknown as string);
         return Number.isNaN(v) ? 0 : v;
      });
      return {
         min: Math.min(...values),
         max: Math.max(...values),
      };
   };

   const priceMM = minMax('price');
   const sqmMM = minMax('sqm');
   const yearMM = minMax('year');
   const roomsMM = minMax('rooms');

   const normalize = (value: number | string, min: number, max: number) => {
      const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
      if (max === min) return 1;
      return (numValue - min) / (max - min);
   };

   return properties.map((property) => {
      const priceScore = 1 - normalize(property.price, priceMM.min, priceMM.max);

      const sqmScore = normalize(property.sqm, sqmMM.min, sqmMM.max);

      const yearScore = normalize(property.year, yearMM.min, yearMM.max);
      const roomsScore = normalize(property.rooms, roomsMM.min, roomsMM.max);

      const score =
         priceScore * weights.price + sqmScore * weights.sqm + yearScore * weights.year + roomsScore * weights.rooms;

      return {
         ...property,
         score: Number(score.toFixed(3)),
      };
   });
}
