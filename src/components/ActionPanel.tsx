import { Download, PlusCircle, Trash } from "lucide-react";
import { Tooltip } from "./ui/Tooltip";
import { useEffect, useState } from "react";
import { useStorage } from "@/hooks/useStorage";

export const ActionPanel = () => {
   // states
   const [isDraggingOver, setIsDraggingOver] = useState(false);

   // hooks
   const $save = useStorage();

   useEffect(() => {
      // avoid dropping outside of actionpanel
      const handleWindowDragOver = (e: DragEvent) => e.preventDefault();
      const handleWindowDrop = (e: DragEvent) => e.preventDefault();

      window.addEventListener("dragover", handleWindowDragOver);
      window.addEventListener("drop", handleWindowDrop);

      return () => {
         window.removeEventListener("dragover", handleWindowDragOver);
         window.removeEventListener("drop", handleWindowDrop);
      };
   }, []);


   const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(true);
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // wichtig, sonst feuert onDrop nicht
   };

   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
   };

   const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);

      const content = await e.dataTransfer.files?.[0]?.text();
      if (content) {
         // TODO onAction('import', content);
      }
   };

   const renderContent = () => {
      if (isDraggingOver) {
         return <div className="text-black">Datei hier ablegen</div>;
      }

      return (
         <>
            <a
               href="/add"
               className="enabled:cursor-pointer p-2 enabled:hover:scale-125 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Tooltip text="Neue Immobilie hinzufügen">
                  <PlusCircle size={18} />
               </Tooltip>
            </a>
            <button
               disabled={$save.listings.length === 0}
               onClick={() => {/*TODO delete*/ }}
               className="enabled:cursor-pointer p-2 enabled:hover:scale-125 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Tooltip text="Alle Immobilien löschen">
                  <Trash size={18} />
               </Tooltip>
            </button>
            <button
               onClick={() => {/*TODO save*/ }}
               className="enabled:cursor-pointer p-2 enabled:hover:scale-125 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Tooltip text="Daten speichern">
                  <Download size={18} />
               </Tooltip>
            </button>
         </>
      );
   }

   return (
      <div>
         {isDraggingOver && (
            <div className="fixed inset-0 bg-black/60 z-10 pointer-events-none transition-opacity" />
         )}

         <div className="fixed inset-x-0 bottom-4 flex justify-center z-20">
            <div className={`bg-gray-100 shadow-2xl rounded-full px-6 py-4 border-1 border-gray-200 transition-all ${isDraggingOver ? 'border-4 border-white' : ''}`}
               onDragEnter={handleDragEnter}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}>
               <div className="flex items-center">
                  {renderContent()}
               </div>
            </div>
         </div>
      </div>
   );
}