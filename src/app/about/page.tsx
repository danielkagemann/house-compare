import { Hero } from "@/components/Hero";

export default function AboutPage() {
   return (
      <div className="max-w-5xl w-full mx-auto py-4">
         <Hero>
            <strong>Changelog</strong>
            <ul className="text-sm text-nowrap">
               <li>Immobilien manuell oder von idealista Quelltext hinzufügen</li>
               <li>Export und Import von Daten</li>
               <li>Speicherung im Browser</li>
               <li>Favoritenliste speichern</li>
               <li>Vergleich von Immobilien nach Benutzerauswahl (bis zu 3)</li>
               <li>Startpunkt zur Berechnung der Entfernung (Luftlinie) hinzufügen</li>
               <li>Responsive Design für mobile und Desktop-Geräte</li>
               <li>Erkennung von Ländern</li>
            </ul>
         </Hero>
      </div>
   );
}