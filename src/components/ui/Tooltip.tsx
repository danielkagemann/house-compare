import { ReactNode, useRef, useState } from "react";

type Props = {
   children: ReactNode;
   text: string;
   delay?: number;
   position?: "bottom" | "right" | "left"
};

export const Tooltip = ({ children, text, delay = 300, position = "bottom" }: Props) => {
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


   function getClassName() {
      if (position === "bottom") {
         return "top-full left-1/2 -translate-x-1/2 mb-2";
      }
      if (position === "right") {
         return "top-full left-0 mb-2";
      }
      if (position === "left") {
         return "top-full right-0 mb-2";
      }
      return ""
   }

   return (
      <div
         className="relative"
         onMouseEnter={showTooltip}
         onMouseLeave={hideTooltip}
      >
         {children}
         {visible && (
            <div className={`absolute ${getClassName()} px-2 py-1 text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap text-xs z-50`}>
               {text}
            </div>
         )
         }
      </div >
   );
};