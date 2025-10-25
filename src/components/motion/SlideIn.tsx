import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

type SlideInProps = {
   children: React.ReactNode,
   delay?: number,
   duration?: number,
   amount?: number,
   direction?: "left" | "right" | "top" | "bottom",
   className?: string
};

export default function SlideIn({
   children,
   delay = 0,
   duration = 0.5,
   amount = 50,
   direction = "left",
   className = ''
}: SlideInProps) {
   const ref = useRef(null);
   const inView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
   const controls = useAnimation();

   useEffect(() => {
      if (inView) {
         controls.start({
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
               duration,
               delay,
               ease: "easeOut",
            },
         });
      }
   }, [inView, controls, delay, duration]);

   const getInitial = () => {
      switch (direction) {
         case "left":
            return { x: -amount, opacity: 0 };
         case "right":
            return { x: amount, opacity: 0 };
         case "top":
            return { y: -amount, opacity: 0 };
         case "bottom":
            return { y: amount, opacity: 0 };
         default:
            return { x: 0, opacity: 0 };
      }
   };

   return (
      <motion.div
         className={className}
         ref={ref}
         initial={getInitial()}
         animate={controls}
      >
         {children}
      </motion.div>
   );
}