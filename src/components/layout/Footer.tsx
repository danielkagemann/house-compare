"use client";

import Link from 'next/link';
import { useStorage } from '@/store/storage';
import { useDeleteAccount, useValidateToken } from '@/lib/fetch';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

function isShareMode() {
   if (globalThis.window !== undefined) {
      return globalThis.window.location.pathname === '/shared/';
   }
   return false;
}

export const Footer = () => {
   // hooks
   const t = useTranslations();
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
               <div className="text-primary hover:underline text-xs">{t("footer.removeAccount")}</div>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{t("footer.areYouSure")}</DialogTitle>
                  <DialogDescription>
                     {t("footer.thisActionCannotBeUndone")}
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">{t("footer.cancel")}</Button>
                  </DialogClose>
                  <Button onClick={onRemoveAccount}>{t("footer.deleteAccount")}</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <footer className="w-full p-4 lg:p-12 mt-4 flex flex-col gap-1 text-sm text-gray-600 bg-gray-50">
         <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col gap-1 items-start">
               <div><strong>Villaya</strong>{t("footer.private")}<a href="https://danielkagemann.name">Daniel Kagemann</a></div>
               <Link href="https://paypal.me/DanielKagemann" className="text-primary hover:underline text-xs">{t("footer.supportViaPaypal")}</Link><br />
               {renderConfirmDialog()}
               {$auth && !isShareMode() &&
                  <button className="text-primary text-left text-xs hover:underline" onClick={onSignOff}>{t("footer.signOff")}</button>}
            </div>
            <div className="flex gap-1 text-xs items-end justify-end flex-col lg:flex-row lg:gap-3">
               <Link href="/impressum" className="text-primary hover:underline">{t("footer.imprint")}</Link>
               <Link href="/datenschutz" className="text-primary hover:underline">{t("footer.privacyPolicy")}</Link>
            </div>
         </div>
      </footer>
   );
};