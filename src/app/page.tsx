"use client";

import { Heart } from "@/components/animate-ui/icons/heart";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Send } from "@/components/animate-ui/icons/send";
import { Hero } from "@/components/Hero";
import { Loading } from "@/components/Loading";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useStorage } from "@/context/storage-provider";
import { Endpoints, useConfirmCode } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";

type UserAction = {
  type: "email" | "code";
  value: string;
}

export default function Home() {
  // state
  const [action, setAction] = useState<UserAction>({ type: "email", value: "" });
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState<boolean>(false);

  // hooks
  const $router = useRouter();
  const $save = useStorage();

  // queries
  const $confirmMutation = useConfirmCode();

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

    if (!response.ok) {
      const err = await response.json();
      setError(err.message ?? "Fehler beim Anmelden");
      setWorking(false);
      return;
    } else {
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
    setError(err.message ?? "Fehler beim Bestätigen des Codes");
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
  function renderAction() {
    if (action.type === "email") {
      return (
        <Hero>
          <form className="flex flex-col gap-2" onSubmit={onSignIn}>
            <div className="font-bold text-sm">Direkt loslegen...</div>
            <Input type="email" placeholder="Deine E-Mail Adresse" value={action.value} onChange={(e) => setAction({ type: "email", value: e.target.value })} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit">Anmelden</Button>
          </form>
        </Hero>
      );
    }

    return (
      <Hero>
        <form className="flex flex-col gap-2" onSubmit={onConfirmCode}>
          <div className="font-bold text-sm">Bestätigungscode aus der EMail</div>
          <InputOTP
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
          <Button type="submit">Bestätigen</Button>
        </form>
      </Hero>
    );
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
      <div className="flex flex-col gap-2 w-full lg:w-1/3">
        <div className="flex gap-1 items-center">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
            {icon}
          </div>
          <h4 className="text-md font-semibold">{label}</h4>
        </div>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    );
  }

  if (working) {
    return <Loading />;
  }

  return (
    <>
      <PageLayout className="min-h-screen items-center justify-center">
        {renderAction()}
      </PageLayout>
      <PageLayout className="flex lg:flex-row flex-col items-start gap-4 lg:px-0 px-4">
        {renderFeature("Sammle Deine Favoriten", <Heart animateOnView loop loopDelay={1000} size={16} />, "Suche atemberaubende Villen aus aller Welt und speichere diejenigen, die deine Fantasie beflügeln. Erstelle eine persönliche Sammlung, die deinen einzigartigen Geschmack widerspiegelt.")}
        {renderFeature("Speichere mit Deiner Email", <Layers animateOnView loop loopDelay={1000} size={16} />, "Melde dich einfach mit deiner E-Mail-Adresse an, um eine Sammlung zu erstellen und von überall darauf zuzugreifen.")}
        {renderFeature("Teile Deine Sammlung", <Send animateOnView loop loopDelay={1000} size={16} />, "Erstelle einen teilbaren Link, um deine Sammlung mit Familie und Freunden zu teilen.")}
      </PageLayout>
    </>
  );
}
