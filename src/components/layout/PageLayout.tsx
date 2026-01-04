import Image from "next/image";
import { Footer } from "./Footer";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <>
         <div className="p-4 md:p-8 flex flex-col justify-between h-full">
            {/* logo */}
            <div className="mb-4">
               <div className="flex gap-1 justify-start items-center">
                  <Image src="/assets/images/main-logo.webp" alt="Villaya Logo" width={32} height={32} />
                  <div className="text-lg font-bold">Villaya</div>
               </div>
            </div>
            {children}
         </div>
         <Footer />
      </>
   );
};