import { ListingDetails } from "@/components/ListingDetails";
import { Loading } from "@/components/Loading";
import { Suspense } from "react";

export default function AddPage() {
   return (
      <Suspense fallback={<Loading />}>
         <ListingDetails />
      </Suspense>
   );
};
