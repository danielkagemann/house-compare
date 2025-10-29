"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorage } from "@/context/storage-provider";
import { User } from "@/model/user";
import { Heart, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserAction = {
  type: "email" | "code";
  value: string;
}

export default function Home() {
  // state
  const [action, setAction] = useState<UserAction>({ type: "email", value: "" });

  // hooks
  const $router = useRouter();
  const $save = useStorage();

  function validAndContinue(data: User) {
    $save.setUser(data);
    $router.push("/properties")
  }

  async function onSignIn() {
    const response = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: action.value }),
    });

    if (!response.ok) {
      // TODO handle error
      console.error("Failed to sign in");
      return;
    } else {
      // depending on status we do something else
      if (response.status === 204) {
        // email sent, ask for code
        setAction({ type: "code", value: "" });
        return;
      }
      const data = await response.json();
      validAndContinue(data);
      setAction({ type: "code", value: "" });
    }
  }

  async function onConfirmCode() {
    const response = await fetch(`/api/verify-code?code=${action.value}`, {
      method: "GET",
    });

    if (!response.ok) {
      // TODO handle error
      console.error("Failed to verify code");
      return;
    }
    const data = await response.json();
    validAndContinue(data);
    console.log("Confirm code:", action.value);
  }

  function renderAction() {
    if (action.type === "email") {
      return (
        <div className="flex flex-col ga-2">
          <p>Beginne mit Deiner Sammlung</p>
          <div className="flex gap-1">
            <Input type="email" placeholder="Deine E-Mail Adresse" value={action.value} onChange={(e) => setAction({ type: "email", value: e.target.value })} />
            <Button onClick={onSignIn}>Anmelden</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col ga-2">
        <p>Bitte gib den Bestätigungs-Code ein</p>
        <div className="flex gap-1">
          <Input type="text" placeholder="Bestätigungs-Code" value={action.value} onChange={(e) => setAction({ type: "code", value: e.target.value })} />
          <Button onClick={onConfirmCode}>Bestätigen</Button>
        </div>
      </div>
    );
  }

  function renderFeature(label: string, icon: React.ReactNode, text: string) {
    return (
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
          {icon}
        </div>
        <h4 className="text-lg font-semibold">{label}</h4>
        <p className="text-center text-gray-600">{text}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 space-y-4">
      <div className="max-w-6xl w-full flex flex-row items-center gap-12">

        {/* Left side */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Image src="/assets/images/main-logo.png" alt="Villaya Logo" width={72} height={72} />
            <h1 className="text-3xl font-bold text-gray-900">Villaya</h1>
          </div>

          <p className="text-gray-600 max-w-md mx-0">
            Finde den Ort, an dem du wirklich ankommst.
            Villaya hilft dir, deine Lieblingshäuser zu sammeln, zu vergleichen und das Zuhause zu entdecken, das sich richtig anfühlt.
          </p>

          {renderAction()}

        </div>

        {/* Right side */}
        <div>
          <img
            src="/assets/images/main-bg.jpg"
            alt="Beach villas"
            className="w-full rounded-2xl object-cover"
          />
        </div>
      </div>

      <div className="max-w-6xl w-full flex flex-row gap-8 justify-center items-center">
        {renderFeature("Sammle Deine Favoriten", <Heart size={16} />, "Suche atemberaubende Villen aus aller Welt und speichere diejenigen, die deine Fantasie beflügeln. Erstelle eine persönliche Sammlung, die deinen einzigartigen Geschmack widerspiegelt.")}
        {renderFeature("Speichere mit Deiner Email", <Send size={16} />, "Melde dich einfach mit deiner E-Mail-Adresse an, um eine Sammlung zu erstellen und von überall darauf zuzugreifen.")}
        {renderFeature("Teile Deine Sammlung", <Heart size={16} />, "Erstelle einen teilbaren Link, um deine Sammlung mit Familie und Freunden zu teilen.")}
      </div>
    </div>
  );
}
