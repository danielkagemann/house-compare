"use client";

import { HouseCard } from "@/components/HouseCard";
import { ActionPanel } from "@/components/ActionPanel";
import { useStorage } from "@/hooks/storage-provider";

export default function Home() {

  // hooks
  const $storage = useStorage();

  function renderEmpty() {
    if ($storage.listings.length > 0) {
      return null;
    }
    return (<div className="p-4">
      <h2 className="font-bold text-lg">Herzlich Willkommen,</h2>
      <p className="text-gray-600 text-md mt-4">
        Speichere Deine Immobilien hier und wähle aus der Liste aus, welche Du miteinander vergleichen möchtest.
        Füge neue Immobilien von Idealista oder manuell hinzu. Alle Daten werden lokale gespeichert und sind beim nächsten Besuch wieder verfügbar.<br />
        Diese Webanwendung ist ein privates Projekt von <a className="text-primary hover:underline font-bold" href="https://danielkagemann.name">Daniel Kagemann</a>.
      </p>
    </div>);
  }

  return (
    <>
      {renderEmpty()}
      <div className="p-4 grid grid-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {
          $storage.listings.map((item) => (
            <HouseCard
              key={item.uuid}
              data={item}
              isSelected={$storage.selectionContains(item.uuid)}
              onSelect={() => $storage.selectionToggle(item.uuid)} />))
        }
      </div>
      <ActionPanel />
    </>
  );
};

