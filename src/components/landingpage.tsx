"use client";

import { Heart } from "@/components/animate-ui/icons/heart";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Send } from "@/components/animate-ui/icons/send";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useStorage } from "@/store/storage";
import { Endpoints, useConfirmCode } from "@/lib/fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { RenderIf } from "./renderif";
import { Main } from "./layout/Main";
import { Footer } from "./layout/Footer";

type UserAction = {
   type: "start" | "email" | "code";
   value: string;
}

export const LandingPage = () => {
   // state
   const [action, setAction] = useState<UserAction>({ type: "start", value: "" });
   const [error, setError] = useState<string | null>(null);
   const [working, setWorking] = useState<boolean>(false);
   const [feature, setFeature] = useState<number>(0);

   // hooks
   const t = useTranslations("main");
   const $router = useRouter();
   const $save = useStorage();
   const $params = useSearchParams();

   // queries
   const $confirmMutation = useConfirmCode();

   // listener for mount
   useEffect(() => {
      if ($save.token !== null && $params.get('init') === null) {
         $router.push("/properties");
      }
   }, [$router, $save, $params]);

   // listener for feature rotation
   useEffect(() => {
      setTimeout(() => {
         setFeature((prev) => (prev + 1) % 3);
      }, 4000);
   }, [feature]);

   /**
    * validate data and continue
    * @param data 
    */
   function validAndContinue(data: { token: string }) {
      $save.tokenSet(data.token);
      $router.push("/properties")
   }

   /**
    * try to sign in with email
    * @returns 
    */
   async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      flushSync(() => setWorking(true));

      const response = await Endpoints.authSignIn(action.value);

      if (response.ok) {
         // depending on status we do something else
         if (response.status === 204) {
            // email sent, ask for code
            setAction({ type: "code", value: "" });
            setWorking(false);
            return;
         }

         const data = await response.json();
         validAndContinue(data);
         setAction({ type: "code", value: "" });
         setWorking(false);
      } else {
         const err = await response.json();
         setError(err.message ?? t("signinError"));
         setWorking(false);
      }
   }

   if ($confirmMutation.isSuccess && !working) {
      flushSync(() => setWorking(false));
      const data = $confirmMutation.data;
      validAndContinue(data.token);
   }

   if ($confirmMutation.isError) {
      flushSync(() => setWorking(false));
      const err = $confirmMutation.error as any;
      setError(err.message ?? t("confirmError"));
   }

   /**
    * try to confirm code
    * @returns 
    */
   async function onConfirmCode(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      flushSync(() => setWorking(true));
      $confirmMutation.mutate(action.value);
   }

   /**
    * render the input depending on type
    * @returns 
    */
   function renderBottom() {
      if (action.type === "start") {
         return (
            <div className="flex flex-col justify-between h-full">
               <RenderIf condition={feature === 0}>
                  {renderFeature(t("collect"), <Heart animateOnView loop loopDelay={1000} size={16} />, t("collectDescription"))}
               </RenderIf>
               <RenderIf condition={feature === 1}>
                  {renderFeature(t("saveWithEmail"), <Layers animateOnView loop loopDelay={1000} size={16} />, t("saveWithEmailDescription"))}
               </RenderIf >
               <RenderIf condition={feature === 2}>
                  {renderFeature(t("shareCollection"), <Send animateOnView loop loopDelay={1000} size={16} />, t("shareCollectionDescription"))}
               </RenderIf>
            </div>
         );
      }
      return null;
   }

   /**
    * render features
    * @param label 
    * @param icon 
    * @param text 
    * @returns 
    */
   function renderFeature(label: string, icon: React.ReactNode, text: string) {
      return (
         <div className="flex justify-start items-center gap-2 bg-white shadow-sm p-4 rounded-full text-xs">
            <div className="max-w-16">
               <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                  {icon}
               </div>
            </div>
            <div className="flex flex-col items-start">
               <h4 className="font-semibold">{label}</h4>
               <p className="text-gray-600">{text}</p>
            </div>
         </div>
      );
   }

   if (working) {
      return <Loading />;
   }

   /**
    * call to action area
    * @returns 
    */
   function renderCallToAction() {
      if (action.type === "start") {
         return (
            <div>
               <Button onClick={() => setAction({ type: "email", value: "" })}
                  className="rounded-full">
                  <div className="flex gap-1 items-center">{t("startnow")} <ArrowRight /></div>
               </Button>
            </div>);
      }

      if (action.type === "email") {
         return (
            <form className="flex flex-col gap-2" onSubmit={onSignIn}>
               <div className="font-bold text-sm">{t("startnow")}</div>
               <Input autoFocus type="email" placeholder={t("email")} value={action.value} onChange={(e) => setAction({ type: "email", value: e.target.value })} />
               {error && <div className="text-red-600 text-sm">{error}</div>}
               <Button type="submit">{t("register")}</Button>
            </form>
         );
      }

      return (
         <form className="flex flex-col gap-2" onSubmit={onConfirmCode}>
            <div className="font-bold text-sm">{t("confirmCodeFromEmail")}</div>
            <InputOTP
               autoFocus
               maxLength={6}
               value={action.value}
               onChange={(value) => setAction({ type: "code", value })}
            >
               <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
               </InputOTPGroup>
            </InputOTP>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit">{t("confirm")}</Button>
         </form>
      );
   }

   return (
      <>
         <Main>
            <>
               {/* tagline */}
               <div className="space-y-4">
                  <div className="font-bold text-5xl">{t("headline")}</div>
                  <div className="text-base/loose text-gray-700">
                     {t("tagline")}
                  </div>

                  {renderCallToAction()}

               </div>

               {/* action (dynamic) */}
               <div>
                  {renderBottom()}
               </div>
            </>
         </Main>
         <Footer />
      </>
   );
}
