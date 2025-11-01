import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import { ListingShare } from "@/components/ListingShare";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ListingShare />
    </Suspense>
  );
};

