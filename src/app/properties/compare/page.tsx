import { Suspense } from "react";
import { ListingComparison } from "@/components/ListingComparison";
import { Loading } from "@/components/Loading";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ListingComparison />
    </Suspense>
  );
};

