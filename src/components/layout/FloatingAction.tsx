import { List } from "../animate-ui/icons/list";
import { MapPin } from "../animate-ui/icons/map-pin";

export type FloatingActionType = 'list' | 'map';

interface FloatingActionProps {
   selected: FloatingActionType;
   onChange: (value: FloatingActionType) => void;
}

export const FloatingAction = ({ selected, onChange }: FloatingActionProps) => {
   return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-100 text-gray-800 shadow-xl rounded-full px-6 py-3 flex gap-2">
         <button className={selected === 'list' ? "bg-gray-300 p-2 rounded-md" : " p-2 rounded-md"} onClick={() => onChange('list')}>
            <List animateOnHover size={18} />
         </button>
         <button className={selected === 'map' ? "bg-gray-300 p-2 rounded-md" : " p-2 rounded-md"} onClick={() => onChange('map')}>
            <MapPin animateOnHover size={18} />
         </button>
      </div>
   );
}