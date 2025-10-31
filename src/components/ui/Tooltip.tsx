import { ReactNode, useRef, useState } from "react";

type Props = {
   children: ReactNode;
   text: string;
   delay?: number;
};

export const Tooltip = ({ children, text, delay = 300 }: Props) => {
   const [visible, setVisible] = useState(false);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   const showTooltip = () => {
      timeoutRef.current = setTimeout(() => {
         setVisible(true);
      }, delay);
   };

   const hideTooltip = () => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
      setVisible(false);
   };

   return (
      <div
         className="relative"
         onMouseEnter={showTooltip}
         onMouseLeave={hideTooltip}
      >
         {children}
         {visible && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 
                        px-2 py-1 text-white bg-gray-800 rounded-md shadow-lg 
                        whitespace-nowrap text-xs z-50">
               {text}
            </div>
         )}
      </div>
   );
};