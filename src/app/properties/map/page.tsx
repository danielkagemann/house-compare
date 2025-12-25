import { ListingMap } from "@/components/ListingMap";
import { Loading } from "@/components/Loading"
import { Suspense } from "react"

export default function Page() {
   return <Suspense fallback={<Loading />}>
      <ListingMap />
   </Suspense>;
}