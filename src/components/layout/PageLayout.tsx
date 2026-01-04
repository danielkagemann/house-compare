import Image from "next/image";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="p-16 flex flex-col justify-between h-full">
         {/* logo */}
         <div>
            <div className="flex gap-1 justify-start items-center">
               <Image src="/assets/images/main-logo.webp" alt="Villaya Logo" width={24} height={24} />
               <div className="text-lg font-bold">Villaya</div>
            </div>
         </div>
         {children}
      </div>
   );
};