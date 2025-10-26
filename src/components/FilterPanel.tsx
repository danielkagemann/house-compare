import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Drawer, DrawerContent } from "./ui/drawer";
import { useStorage } from "@/hooks/storage-provider";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

export const FilterPanel = () => {

   // state
   const [open, setOpen] = useState(false);

   // hooks
   const $save = useStorage();

   return (
      <>
         <Button variant="outline" onClick={() => setOpen(true)}><Sparkles size={18} /></Button>

         <Drawer open={open} onOpenChange={setOpen} direction="top">
            <DrawerContent>
               <div className="p-8">
                  <strong className="text-lg">Filtermöglichkeiten</strong>
                  <p className="text-sm text-gray-700">Hier kannst Du die Immobilien nach bestimmten Kriterien filtern.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
                     {/*view*/}
                     <div className="flex flex-col gap-1">
                        <strong>Einstellungen zur Ansicht</strong>
                        <div className="flex items-center space-x-2">
                           <Switch checked={$save.filter.compactView} onCheckedChange={(checked) => $save.filterUpdate({ ...$save.filter, compactView: checked })} />
                           <div>kompakte Ansicht</div>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Switch checked={$save.filter.removeFromList} onCheckedChange={(checked) => $save.filterUpdate({ ...$save.filter, removeFromList: checked })} />
                           <div>ausgefilterte Immobilien entfernen</div>
                        </div>
                     </div>

                     {/*attributes*/}
                     <div className="flex flex-col gap-1">
                        <strong>Einstellungen zu den Merkmalen</strong>
                        <div className="flex gap-1 items-center">
                           <div className="text-gray-700">Max. Preis (€):</div>
                           <Input type="number" value={$save.filter.maxPrice} className="w-32" onChange={(e) => $save.filterUpdate({ ...$save.filter, maxPrice: Number(e.target.value) })} />
                        </div>
                        <div className="flex gap-1 items-center">
                           <div className="text-gray-700">Min. Wohnfläche:</div>
                           <Input type="number" value={$save.filter.minArea} className="w-32" onChange={(e) => $save.filterUpdate({ ...$save.filter, minArea: Number(e.target.value) })} />
                        </div>
                     </div>
                  </div>
               </div>
            </DrawerContent>
         </Drawer>
      </>
   );

}