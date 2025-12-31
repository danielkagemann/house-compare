import { Hero } from "./Hero";
import { PageLayout } from "./PageLayout";

export function ImpressumContent() {
   return (
      <PageLayout className="min-h-screen items-center justify-center">
         <Hero>
            <div className="text-gray-700 space-y-2">

               <h1 className="text-lg font-semibold">Impressum</h1>

               <address>Daniel Kagemann<br />
                  Rosenstrasse 16<br />
                  75328 Sch&ouml;mberg</address>

               <h2 className="text-md font-semibold mt-2">Kontakt</h2>
               <p>Telefon: 07084 9344532<br />
                  E-Mail: info@danielkagemann.name</p>

               <p>Quelle: <a href="https://www.e-recht24.de">eRecht24</a></p>


               <h2 className="text-md font-semibold mt-2">Über villaya</h2>

               Villaya ist ein privates Projekt von <a href="https://danielkagemann.name">Daniel Kagemann</a>.<br /><br />
               Die Idee zu Villaya entstand aus der persönlichen Notwendigkeit heraus, Immobilienangebote effizient zu vergleichen und zu verwalten. Viele Plattformen bieten zwar umfangreiche Suchfunktionen, doch fehlte oft die Möglichkeit, Favoriten einfach zu speichern und später wieder aufzurufen.<br /><br />
               Mit Villaya möchte ich eine Lösung bieten, die es Nutzern ermöglicht, ihre bevorzugten Immobilienangebote zentral zu speichern und jederzeit darauf zugreifen zu können. Dabei lege ich großen Wert auf Datenschutz und Benutzerfreundlichkeit.<br /><br />

               Ich freue mich über Feedback und Anregungen, um Villaya kontinuierlich zu verbessern und an die Bedürfnisse der Nutzer anzupassen.
            </div>
         </Hero>
      </PageLayout>
   );
}