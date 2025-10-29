import { Suspense } from "react";
import { ListingComparison } from "@/components/ListingComparison";

export default function Home() {
  return (
    <Suspense fallback={<div className="w-screen h-screen flex justify-center items-center">Daten werden geladen...</div>}>
      <ListingComparison />
    </Suspense>
  );
};

