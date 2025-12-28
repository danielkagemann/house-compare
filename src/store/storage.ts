import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

import { Location } from '@/model/Listing';

type StorageState = {
   location: Location | null;
   selected: string[];
   token: string | null;

   selectionToggle: (id: string) => void;
   selectionContains: (id: string) => boolean;
   locationSet: (loc: Location | null) => void;
   tokenSet: (value: string | null) => void;
};

export const useStorage = create<StorageState>()(
   persist(
      (set, get) => ({
         location: null,
         selected: [],
         token: null,

         selectionToggle: (id: string) => {
            const normalized = id.trim();
            if (!normalized) return;

            const current = get().selected.map((x) => x.trim());
            const isSelected = current.includes(normalized);

            if (isSelected) {
               set({ selected: current.filter((x) => x !== normalized) });
               return;
            }

            const next = Array.from(new Set([...current, normalized]));
            if (next.length > 3) {
               toast.error('Es können maximal 3 Immobilien zum Vergleich ausgewählt werden.');
               return;
            }

            set({ selected: next });
         },

         selectionContains: (id: string) => {
            const normalized = id.trim();
            return get().selected.some((x) => x.trim() === normalized);
         },

         locationSet: (loc) => set({ location: loc }),
         tokenSet: (token) => set({ token }),
      }),
      {
         name: 'villaya-storage',
         partialize: (s) => ({
            selected: s.selected,
            token: s.token,
         }),
         version: 1,
      }
   )
);
