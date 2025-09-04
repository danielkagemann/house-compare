import { Dot, Download, SquarePlus, Trash } from "lucide-react";
import { Tooltip } from "./ui/Tooltip";
import { useEffect, useState } from "react";

type Props = {
   onAction: (type: string, data?: string) => void
   disabled?: string[]
};

export const ActionPanel = ({ onAction, disabled = [] }: Props) => {
   const [isDraggingOver, setIsDraggingOver] = useState(false);

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
         onAction('import', content);
      }
   };

   const renderContent = () => {
      if (isDraggingOver) {
         return <div className="text-black">Datei hier ablegen</div>;
      }

      return (
         <>
            <button
               disabled={disabled.includes('delete')}
               onClick={() => onAction('delete')}
               className="enabled:cursor-pointer p-2 enabled:hover:scale-125 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Tooltip text="Alle Immobilien löschen">
                  <Trash className="w-4 h-4" />
               </Tooltip>
            </button>
            <Dot className="w-4 h-4 text-gray-700" />
            <button
               disabled={disabled.includes('add')}
               onClick={() => onAction('add')}
               className="enabled:cursor-pointer p-2 enabled:hover:scale-125 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Tooltip text="Neue Immobilie hinzufügen">
                  <SquarePlus className="w-4 h-4" />
               </Tooltip>
            </button>
            <button
               disabled={disabled.includes('save')}
               onClick={() => onAction('save')}
               className="enabled:cursor-pointer p-2 enabled:hover:scale-125 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Tooltip text="Daten speichern">
                  <Download className="w-4 h-4" />
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
            <div className={`bg-white shadow-2xl rounded-2xl px-6 py-3 border-1 border-gray-200 transition-all ${isDraggingOver ? 'border-4 border-white' : ''}`}
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