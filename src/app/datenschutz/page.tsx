import { DatapolicyContent } from "@/components/datapolicy";
import { Loading } from "@/components/Loading";
import { Suspense } from "react";

export default function Page() {
   return (
      <Suspense fallback={<Loading />}>
         <DatapolicyContent />
      </Suspense>
   );
}
