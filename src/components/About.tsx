import { Info } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export const About = () => (
   <Dialog>
      <DialogTrigger><Button variant="outline"><Info size={14} /></Button></DialogTrigger>
      <DialogContent>
         <DialogHeader>
            <DialogTitle>Über house compare</DialogTitle>
            <DialogDescription>
               Mit dieser kleinen Anwendung kannst Du Immobilien sammeln, die Du bei verschiedenen Anbietern gefunden hast. Füge einfach die Links zu den Immobilien hinzu, die Dich interessieren, und house compare wird die wichtigsten Informationen extrahieren und übersichtlich darstellen. So kannst Du schnell und einfach die besten Angebote finden und vergleichen.
            </DialogDescription>
         </DialogHeader>
         <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Immobilien manuell oder von idealista Quelltext hinzufügen</li>
            <li>Export und Import von Daten</li>
            <li>Speicherung im Browser</li>
            <li>Favoritenliste speichern</li>
            <li>Vergleich von Immobilien nach Benutzerauswahl (bis zu 3)</li>
            <li>Startpunkt zur Berechnung der Entfernung (Luftlinie) hinzufügen</li>
            <li>Responsive Design für mobile und Desktop-Geräte</li>
            <li>Erkennung von Ländern</li>
         </ul>
         <p className="text-sm">Diese Anwendung wurde von Daniel Kagemann entwickelt.</p>
      </DialogContent>
   </Dialog>
);