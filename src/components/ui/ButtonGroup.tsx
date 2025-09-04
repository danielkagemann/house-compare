import { ReactElement } from "react";

export type ButtonGroupItem = {
   label: string;
   icon: ReactElement
};

type Props = {
   data: ButtonGroupItem[];
   selected: number;
   onChange: (index: number) => void;
};

export const ButtonGroup = ({ data, selected, onChange }: Props) => {
   return (
      <div className="bg-gray-200 w-fit inline-flex justify-start rounded-xl text-sm p-1">
         {data.map((item: ButtonGroupItem, index: number) => (
            <button
               key={index}
               className={`flex items-center  justify-start gap-1 px-2  py-1 cursor-pointer rounded-xl ${index === selected ? 'bg-primary text-white font-bold' : 'text-gray-700'}`}
               onClick={() => onChange(index)}
            >
               {item.icon}
               {item.label}
            </button>
         ))}
      </div>
   );
}