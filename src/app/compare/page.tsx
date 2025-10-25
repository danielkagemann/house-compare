"use client";
import { useState } from "react";
import Image from "next/image";
import { Listing } from "@/model/Listing";
import { Results } from "@/components/Results";
import { useStorage } from "@/hooks/useStorageInternal";
import { SidebarNewHouse } from "@/components/sidebars/SidebarNewHouse";
import { ActionPanel } from "@/components/ActionPanel";
import SlideIn from "@/components/motion/SlideIn";

export default function Home() {
  // states
  const [visible, setVisible] = useState<boolean>(false);

  // hooks
  const $storage = useStorage();

  /**
   * coming back from sidebar. null means just close otherwise add new item.
   * @param data 
   */
  function handleData(data: Listing | null) {
    if (data) {
      $storage.add(data);
    }
    setVisible(false);
  }

  /**
   * show sidebar
   * @returns 
   */
  const renderSidebar = () => {
    if (!visible) {
      return null;
    }

    return (
      <SidebarNewHouse onChange={handleData} />
    );
  }

  /**
   * callback from actionpanel
   * @param action 
   */
  const handleAction = (action: string, data?: string) => {
    if (action === 'delete') {
      $storage.clear();
    } else if (action === 'add') {
      setVisible(prev => !prev)
    } else if (action === 'save') {
      $storage.exportAsJson(`listings-${new Date().toISOString()}.json`);
    } else if (action === 'import') {
      $storage.importJson(data || '');
    } else {
      throw new Error('action not supported');
    }
  }

  if ($storage.list.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col max-w-xl m-auto h-screen p-4">
        <SlideIn direction="top" duration={0.5} delay={0}>
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/logo.png`} width={135} height={64} alt="logo" />
        </SlideIn>
        <div className="mt-8">
          <SlideIn direction="left" duration={0.5} delay={0.2}>
            <h2 className="font-bold text-lg">Herzlich Willkommen,</h2>
          </SlideIn>
          <SlideIn direction="top" duration={0.5} delay={0.6}>
            <p className="text-gray-600 text-md mt-4">Dies ist eine kleine Anwendung, mit der Du Häuser vergleichen kannst.
              Du kannst die Daten manuell eingeben oder von einer idealista-Immobilienseite importieren. Ein automatischer Import von idealista
              ist leider nicht möglich, aberdu kannst den Quelltext hinzufügen und die Daten werden automatisch extrahiert.
              <br />Alle hinzugefügten Immobilien werden gespeichert. Auch wenn Du die Seite verlässt und wieder kommst, kannst Du
              dort weitermachen, wo Du aufgehört hast. Füge so viele Immobilien hinzu wie Du möchtest.
            </p>
          </SlideIn>
        </div>
        {renderSidebar()}
        <SlideIn amount={0} delay={0.5}>
          <ActionPanel onAction={handleAction} disabled={['delete', 'save']} />
        </SlideIn>
      </div>
    );
  }

  const renderAmount = () => {
    return <div className="bg-primary rounded-full w-12 h-12">
      <span className="text-white font-bold flex justify-center items-center w-full h-full">{$storage.list.length}</span>
    </div>
  }

  return (
    <div className="py-8 px-4 md:px-12 space-y-2">
      <div className="flex justify-between">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/logo.png`} width={135} height={64} alt="logo" />
        {renderAmount()}
      </div>
      <Results list={$storage.list} onDelete={$storage.remove} />
      <ActionPanel onAction={handleAction} />
      {renderSidebar()}
    </div >
  );
};

