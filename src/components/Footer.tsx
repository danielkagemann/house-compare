"use client";

import Link from 'next/link';
import { useStorage } from '@/store/storage';
import { useDeleteAccount, useValidateToken } from '@/lib/fetch';
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Button } from './ui/button';

function isShareMode() {
   if (globalThis.window !== undefined) {
      return globalThis.window.location.pathname === '/shared/';
   }
   return false;
}

export const Footer = () => {
   // hooks
   const $save = useStorage();
   const $auth = useValidateToken()?.data;

   // queries
   const $remove = useDeleteAccount();

   function onSignOff() {
      $save.tokenSet(null);

      if (globalThis.window !== undefined) {
         globalThis.window.location.href = '/';
      }
   }

   async function onRemoveAccount() {
      await $remove.mutateAsync();
      onSignOff();
   }

   function renderConfirmDialog() {
      if (!$auth || isShareMode()) return null;
      return (
         <Dialog>
            <DialogTrigger>
               <div className="text-primary hover:underline text-xs">Konto entfernen</div>
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
               {$auth && !isShareMode() &&
                  <Link href="/properties" className="text-primary hover:underline">Immobilien</Link>}
               {$auth && !isShareMode() &&
                  <Link href="/properties/details" className="text-primary hover:underline">Immobilie hinzufügen</Link>}
               <Link href="/about" className="text-primary hover:underline">Über Villaya</Link>
               {$auth && !isShareMode() &&
                  <button className="text-primary hover:underline" onClick={onSignOff}>Abmelden</button>}
            </div>
         </div>
      </footer>
   );
};