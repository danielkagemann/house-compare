import { Suspense } from "react";

import { ListingList } from "@/components/ListingList";
import { Loading } from "@/components/Loading";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ListingList />
    </Suspense>
  );
};

