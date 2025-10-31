import { Hero } from "@/components/Hero";
import { PageLayout } from "@/components/PageLayout";

export default function AboutPage() {
   return (
      <PageLayout className="min-h-screen items-center justify-center">
         <Hero>
            <div className="text-sm/relaxed text-gray-700">
               Du kannst Immobilien manuell oder direkt aus dem idealista <br />
               Quelltext hinzufügen. Die Anwendung ermöglicht dir den Export <br />
               und Import deiner Daten, wobei alle Informationen lokal in<br />
               deinem Browser gespeichert werden. Du kannst eine Favoritenliste <br />
               erstellen und bis zu 3 Immobilien miteinander vergleichen.<br />
               Zusätzlich kannst du einen Startpunkt festlegen, um die <br />
               Entfernung (Luftlinie) zu den Objekten zu berechnen. <br />
               Die Anwendung verfügt über ein responsives Design für <br />
               mobile und Desktop-Geräte und erkennt automatisch verschiedene Länder.
            </div>
         </Hero>
      </PageLayout>
   );
}