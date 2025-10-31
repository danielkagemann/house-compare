import Link from "next/link";
import { Hero } from "./Hero";
import { PageLayout } from "./PageLayout";
import { Button } from "./ui/button";

export const NoListings = () => (
   <PageLayout className="min-h-screen items-center justify-center">
      <Hero>
         <div className="flex flex-col gap-2">
            <p>Du hast bisher noch keine Traumhäuser gespeichert. Suche nach Deinem persönlichen Traumhaus und speichere die Informationen hier.</p>
            <div className="font-bold text-sm">Du hast eine Immobilie gefunden? Dann schnell eintragen</div>
            <Link href="/properties/details">
               <Button>Immobilie hinzufügen</Button>
            </Link>
         </div>
      </Hero>
   </PageLayout>
);