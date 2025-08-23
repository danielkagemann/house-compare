"use client";
import { useState } from "react";
import Image from "next/image";
import { SidebarSourcecode } from "@/components/SidebarSourcecode";
import { Listing } from "@/model/Listing";
import { Results } from "@/components/Results";
import { useStorage } from "@/hooks/useStorage";


export default function Home() {
  // states
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // hooks
  const $storage = useStorage();

  const parseHtml = async (html: string | null) => {
    setVisible(false);

    if (!html) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      const data: Listing = await res.json();

      if (!("error" in data)) {
        const priceNum = parseFloat(data.price.replace(/[^\d]/g, ""));
        const sqmNum = parseFloat(data.sqm.replace(/[^\d]/g, ""));
        data.pricePerSqm = !isNaN(priceNum) && !isNaN(sqmNum) && sqmNum > 0
          ? (Math.round(priceNum / sqmNum) + ' €')
          : '';
        $storage.add(data);
      } else {
        alert("Fehler: " + (data as any).error);
      }
    } catch (e) {
      console.error(e);
      alert("Fehler beim Abrufen der Daten");
    }

    setLoading(false);
  };

  const renderSidebar = () => {
    if (!visible) {
      return null;
    }

    return (
      <SidebarSourcecode onChange={parseHtml} />
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Image src="/assets/images/logo.png" width={135} height={64} alt="logo" />

      <div className="flex justify-between mb-8">
        <p className="text-gray-500 my-4">Hier kannst Du verschiedene Häuser miteinander vergleichen. Klicke auf Hinzufügen .</p>
        <div>
          <button
            onClick={$storage.clear}
            className="text-primary px-4 py-1 cursor-pointer"
          >
            Alle löschen
          </button>
          <button
            onClick={() => setVisible(prev => !prev)}
            className="bg-primary text-white px-4 py-1 rounded cursor-pointer"
          >
            Hinzufügen
          </button>
        </div>
      </div>
      {renderSidebar()}

      <Results list={$storage.list} />
    </div >
  );
};

