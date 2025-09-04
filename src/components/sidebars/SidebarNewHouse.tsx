import { Listing } from "@/model/Listing";
import { SquareX } from "lucide-react";
import { useState } from "react";
import { ListingFromIdealista } from "./ListingFromIdealista";
import { ListingFromManualInput } from "./ListingFromManualInput";

type Props = {
   onChange: (data: Listing | null) => void
};

export const SidebarNewHouse = ({ onChange }: Props) => {
   const [activeTab, setActiveTab] = useState<number>(0);

   function renderSelect() {
      const tabs = ['idealista', 'Manuell'];

      return (
         <div className="flex flex-col gap-4">
            <p className="text-gray-500 text-xs">Du kannst wählen, ob Du die Daten manuell eingeben möchtest oder mit Hilfe des Quelltextes von idealista.</p>

            <div className="flex border-b border-gray-200">
               {tabs.map((tab, index) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(index)}
                     className={`flex-1 py-2 text-center text-sm cursor-pointer transition-colors ${activeTab === index
                        ? "border-b-1 border-primary text-primary font-bold"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>

            <div className="flex flex-col">
               {activeTab === 0 && <ListingFromIdealista onChange={onChange} />}
               {activeTab === 1 && <ListingFromManualInput onChange={onChange} />}
            </div>


         </div>
      );
   }

   return (
      <div className="bg-black/50 z-50 inset-0 fixed">
         <div className="absolute right-0 top-0 bottom-0 bg-white p-8 max-w-1/3 min-w-md h-screen overflow-y-auto">
            <div className="flex justify-between gap-2">
               <h2 className="text-xl font-bold">Daten hinzufügen...</h2>
               <button type="button" onClick={() => onChange(null)}>
                  <SquareX className="w-5 h-5 cursor-pointer" />
               </button>
            </div>

            {renderSelect()}
         </div>
      </div>
   );
}