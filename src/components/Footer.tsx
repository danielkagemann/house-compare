import Link from 'next/link';
import { useStorage } from '@/context/storage-provider';
import { useIsAuthenticated } from '@/context/useIsAuthenticated';
import { Endpoints } from '@/lib/fetch';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Button } from './ui/button';

export const Footer = () => {
   const $save = useStorage();
   const $auth = useIsAuthenticated();

   function onSignOff() {
      $save.tokenSet(null);
      window.location.href = '/';
   }

   async function onRemoveAccount() {
      const res = await Endpoints.authRemove($save.token ?? '');
      if (res.ok) {
         toast.success('Konto erfolgreich entfernt');
         onSignOff();
      } else {
         toast.error('Fehler beim Entfernen des Kontos');
      }
   }

   function renderConfirmDialog() {
      if (!$auth) return null;
      return (
         <Dialog>
            <DialogTrigger asChild>
               <button className="text-primary hover:underline text-xs" onClick={onRemoveAccount}>Konto entfernen</button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Bist Du sicher?</DialogTitle>
                  <DialogDescription>
                     Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird Dein Konto dauerhaft gelöscht
                     und die Daten von unseren Servern entfernt.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">Nein, nicht löschen</Button>
                  </DialogClose>
                  <Button onClick={onRemoveAccount}>Konto entfernen</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <footer className="w-full p-4 lg:p-12 mt-12 flex flex-col gap-1 text-sm text-gray-600 bg-gray-50">
         <div className="grid grid-cols-2 gap-1">
            <div>
               <strong>Villaya.de</strong>
               <p>Dies ist ein privates Projekt von <a href="https://danielkagemann.name">Daniel Kagemann</a></p>
               <Link href="https://paypal.me/DanielKagemann" className="text-primary hover:underline text-xs">Unterstützen via paypal</Link><br />
               {renderConfirmDialog()}
            </div>
            <div className="flex gap-1 text-xs items-end justify-end flex-col lg:flex-row lg:gap-3">
               <Link href="/" className="text-primary hover:underline">Start</Link>
               {$auth &&
                  <Link href="/properties" className="text-primary hover:underline">Immobilien</Link>}
               {$auth &&
                  <Link href="/properties/details" className="text-primary hover:underline">Immobilie hinzufügen</Link>}
               <Link href="/about" className="text-primary hover:underline">Über Villaya</Link>
               {$auth &&
                  <button className="text-primary hover:underline" onClick={onSignOff}>Abmelden</button>}
            </div>
         </div>
      </footer>
   );
};