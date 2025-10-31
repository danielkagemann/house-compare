import Link from 'next/link';

export const Footer = () => (
   <footer className="w-full p-12 flex flex-col gap-1 text-sm text-gray-600">
      <div className="grid grid-cols-2">
         <div>
            <strong>Villaya.de</strong>
            <p>Dies ist ein privates Projekt von <a href="https://danielkagemann.name">Daniel Kagemann</a></p>
         </div>
         <div className="flex gap-3 text-xs items-end justify-end">
            <Link href="/" className="text-primary hover:underline">Start</Link>
            <Link href="/properties" className="text-primary hover:underline">Immobilien</Link>
            <Link href="/about" className="text-primary hover:underline">Über Villaya</Link>
         </div>
      </div>
   </footer>
);