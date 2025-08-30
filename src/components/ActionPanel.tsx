import { SquarePlus, Trash } from "lucide-react";

type Props = {
   onAction: (type: string) => void
};

export const ActionPanel = ({ onAction }: Props) => {
   return (
      <div className="fixed inset-x-0 bottom-4 flex justify-center z-20">
         <div className="bg-white shadow-2xl rounded-2xl px-6 py-3 border-1 border-gray-200">
            <div className="flex">
               <button
                  onClick={() => onAction('delete')}
                  className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-20"
               >
                  <Trash className="w-4 h-4" />
               </button>
               <button
                  onClick={() => onAction('add')}
                  className="cursor-pointer p-2"
               >
                  <SquarePlus className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   );
}