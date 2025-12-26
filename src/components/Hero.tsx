import { useId } from "react";
import { motion } from "motion/react";
import Image from "next/image";

interface HeroProps {
   children: React.ReactNode;
}

const blobPathKeyframes = [
   "M0.33,0.08 C0.50,0.00 0.73,0.05 0.83,0.20 C0.93,0.35 0.99,0.55 0.90,0.72 C0.81,0.89 0.62,1.00 0.42,0.95 C0.22,0.90 0.05,0.75 0.04,0.55 C0.03,0.35 0.16,0.16 0.33,0.08 Z",
   "M0.28,0.15 C0.48,0.02 0.76,0.03 0.86,0.23 C0.96,0.43 1.00,0.63 0.88,0.80 C0.76,0.97 0.55,1.00 0.36,0.92 C0.17,0.84 0.04,0.70 0.03,0.50 C0.02,0.30 0.12,0.23 0.28,0.15 Z",
   "M0.36,0.05 C0.56,0.03 0.79,0.12 0.88,0.30 C0.97,0.48 0.95,0.68 0.83,0.83 C0.71,0.98 0.52,1.00 0.34,0.93 C0.16,0.86 0.03,0.70 0.05,0.48 C0.07,0.26 0.16,0.07 0.36,0.05 Z",
   "M0.33,0.08 C0.50,0.00 0.73,0.05 0.83,0.20 C0.93,0.35 0.99,0.55 0.90,0.72 C0.81,0.89 0.62,1.00 0.42,0.95 C0.22,0.90 0.05,0.75 0.04,0.55 C0.03,0.35 0.16,0.16 0.33,0.08 Z",
];

export const Hero = ({ children }: HeroProps) => {
   const clipId = useId();

   return (
      <div className="flex flex-col lg:flex-row items-center gap-12">

         {/* Left side */}
         <div className="space-y-6 lg:min-w-sm">
            <div className="flex flex-col gap-2">
               <Image src="/assets/images/main-logo.png" alt="Villaya Logo" width={72} height={72} />
               <h1 className="text-3xl font-bold text-gray-900">Villaya</h1>
            </div>

            <p className="text-gray-600 max-w-md mx-0">
               Finde den Ort, an dem du wirklich ankommst.
               Villaya hilft dir, deine Lieblingshäuser zu sammeln, zu vergleichen und das Zuhause zu entdecken, das sich richtig anfühlt.
            </p>

            {children}

         </div>

         {/* Right side */}
         <div className="lg:px-0 px-4 justify-center flex">
            {/* SVG clipPath (smooth blob) */}
            <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
               <defs>
                  <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                     <motion.path
                        d={blobPathKeyframes[0]}
                        animate={{ d: blobPathKeyframes }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                     />
                  </clipPath>
               </defs>
            </svg>

            <div className="relative w-full h-full overflow-hidden rounded-2xl">
               <motion.div
                  className="relative w-full h-full will-change-[clip-path]"
                  style={{ clipPath: `url(#${clipId})` }}
               >
                  <img
                     src="/assets/images/main-bg.jpg"
                     alt="Beach villas"
                     className="lg:w-full object-cover"
                  />
               </motion.div>
            </div>
         </div>
      </div>
   );
};