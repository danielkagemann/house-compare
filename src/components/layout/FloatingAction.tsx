import { List } from "../animate-ui/icons/list";
import { MapPin } from "../animate-ui/icons/map-pin";

export type FloatingActionType = 'list' | 'map';

interface FloatingActionProps {
   selected: FloatingActionType;
   onChange: (value: FloatingActionType) => void;
}

export const FloatingAction = ({ selected, onChange }: FloatingActionProps) => {
   return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 shadow-xl rounded-full p-4 flex gap-2">
         <button className={selected === 'list' ? "bg-gray-100 p-2 rounded-md" : " p-2 rounded-md"} onClick={() => onChange('list')}>
            <List animateOnHover size={18} />
         </button>
         <button className={selected === 'map' ? "bg-gray-100 p-2 rounded-md" : " p-2 rounded-md"} onClick={() => onChange('map')}>
            <MapPin animateOnHover size={18} />
         </button>
      </div>
   );
}