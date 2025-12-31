import { ImpressumContent } from "@/components/imprint";
import { Loading } from "@/components/Loading";
import { Suspense } from "react";

export default function AboutPage() {
   return (
      <Suspense fallback={<Loading />}>
         <ImpressumContent />
      </Suspense>
   );
}
