import { ListingDetails } from "@/components/ListingDetails";
import { Suspense } from "react";

export default function AddPage() {
   return (
      <Suspense fallback={<div className="w-screen h-screen flex justify-center items-center">Daten werden geladen...</div>}>
         <ListingDetails />
      </Suspense>
   );
};
