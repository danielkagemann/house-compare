import { listingAttributeToText } from "@/model/Listing";

type Props = {
   list: string[];
   selected: string[];
   onChange: (values: string[]) => void;
};

export const FilterList = ({ selected, list, onChange }: Props) => {

   const handleUpdate = (val: string) => () => {
      const newValues = [...selected];
      const id = newValues.indexOf(val);
      if (id === -1) {
         newValues.push(val);
      } else {
         newValues.splice(id, 1);
      }
      onChange(newValues);
   };

   const render = (item: string) => (
      <button type="button"
         key={item}
         onClick={handleUpdate(item)}
         className={`text-xs px-2 py-1 rounded-xl cursor-pointer ${selected.includes(item) ? 'text-white bg-primary border-black' : 'text-gray-800 bg-gray-300 border-gray-500'} border-1 border-dashed`}>
         {listingAttributeToText(item)}
      </button>
   );

   return (
      <div className="flex gap-1 flex-wrap">
         {list.map(render)}
      </div>
   );
};