"use client";

import { Hero } from "@/components/Hero";
import { PageLayout } from "@/components/PageLayout";

export default function AboutPage() {
   return (
      <PageLayout className="min-h-screen items-center justify-center">
         <Hero>
            <div className="text-sm/relaxed text-gray-700">
               Villaya ist ein privates Projekt von <a href="https://danielkagemann.name">Daniel Kagemann</a>.<br /><br />
               Die Idee zu Villaya entstand aus der persönlichen Notwendigkeit heraus, Immobilienangebote effizient zu vergleichen und zu verwalten. Viele Plattformen bieten zwar umfangreiche Suchfunktionen, doch fehlte oft die Möglichkeit, Favoriten einfach zu speichern und später wieder aufzurufen.<br /><br />
               Mit Villaya möchte ich eine Lösung bieten, die es Nutzern ermöglicht, ihre bevorzugten Immobilienangebote zentral zu speichern und jederzeit darauf zugreifen zu können. Dabei lege ich großen Wert auf Datenschutz und Benutzerfreundlichkeit.<br /><br />

               Ich freue mich über Feedback und Anregungen, um Villaya kontinuierlich zu verbessern und an die Bedürfnisse der Nutzer anzupassen.
            </div>
         </Hero>
      </PageLayout>
   );
}