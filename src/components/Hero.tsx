import Image from "next/image";

interface HeroProps {
   children: React.ReactNode;
}

export const Hero = ({ children }: HeroProps) => (
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
      <div>
         <img
            src="/assets/images/main-bg.jpg"
            alt="Beach villas"
            className="w-full rounded-2xl object-cover"
         />
      </div>
   </div>
);