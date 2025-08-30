"use client";
import { useState } from "react";
import Image from "next/image";
import { Listing } from "@/model/Listing";
import { Results } from "@/components/Results";
import { useStorage } from "@/hooks/useStorage";
import { Eraser, SquarePlus } from "lucide-react";
import { SidebarNewHouse } from "@/components/SidebarNewHouse";
import { ActionPanel } from "@/components/ActionPanel";


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

  const handleAction = (action: string) => {
    if (action === 'delete') {
      $storage.clear();
    } else {
      setVisible(prev => !prev)
    }
  }

  return (
    <div className="p-12">
      <div className="flex justify-between">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/logo.png`} width={135} height={64} alt="logo" />

        {
          $storage.list.length > 0 && <div className="bg-primary rounded-full w-12 h-12"><span className="text-white font-bold flex justify-center items-center w-full h-full">{$storage.list.length}</span></div>
        }

      </div>
      <Results list={$storage.list} onDelete={$storage.remove} />
      <ActionPanel onAction={handleAction} />
      {renderSidebar()}
    </div >
  );
};

