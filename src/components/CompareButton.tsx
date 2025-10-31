import { useStorage } from "@/context/storage-provider";
import { GitCompare } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/Tooltip";

export const CompareButton = () => {
   const $save = useStorage();
   const $router = useRouter();

   return (
      <Tooltip text="Immobilien vergleichen">
         <Button variant="outline"
            disabled={$save.selected.length < 2}
            className="relative"
            onClick={() => $router.push('/properties/compare')}
         >
            {$save.selected.length > 0 && (
               <motion.div
                  className="absolute -right-1 -top-1"
                  key={$save.selected.length}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
               >
                  <div className="w-5 h-5 bg-red-700 text-[9px] flex items-center justify-center text-white rounded-full">{$save.selected.length}</div>
               </motion.div>)}
            <GitCompare size={18} />
         </Button>
      </Tooltip >);
}