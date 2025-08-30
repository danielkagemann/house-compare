"use client";
import { useState } from "react";
import Image from "next/image";
import { Listing } from "@/model/Listing";
import { Results } from "@/components/Results";
import { useStorage } from "@/hooks/useStorage";
import { Eraser, SquarePlus } from "lucide-react";
import { SidebarNewHouse } from "@/components/SidebarNewHouse";


export default function Home() {
  // states
  const [visible, setVisible] = useState<boolean>(false);

  // hooks
  const $storage = useStorage();

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/logo.png`} width={135} height={64} alt="logo" />

      <div className="flex justify-between mb-8">
        <p className="text-gray-500 my-4">Hier kannst Du verschiedene Häuser miteinander vergleichen.</p>
        <div className="flex gap-2">
          <button
            onClick={$storage.clear}
            className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-20"
            disabled={$storage.list.length === 0}
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVisible(prev => !prev)}
            className="cursor-pointer p-2"
          >
            <SquarePlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {renderSidebar()}

      <Results list={$storage.list} onDelete={$storage.remove} />
    </div >
  );
};

