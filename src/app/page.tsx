import { Suspense } from "react";
import { LandingPage } from "@/components/landingpage";
import { Loading } from "@/components/Loading";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <LandingPage />
    </Suspense>
  );
}
