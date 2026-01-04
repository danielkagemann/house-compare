import Image from "next/image";

export const Main = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="grid md:grid-cols-2 gap-2 w-screen h-screen">
         <div className="md:p-16 p-4 flex flex-col justify-between md:h-full">
            {/* logo */}
            <div>
               <div className="flex gap-1 justify-start items-center">
                  <Image src="/assets/images/main-logo.webp" alt="Villaya Logo" width={24} height={24} />
                  <div className="text-lg font-bold">Villaya</div>
               </div>
            </div>
            {children}
         </div>
         <div>
            <video src="/assets/villaya.mp4" autoPlay loop muted className="w-full h-full object-cover z-0">
               your browser does not support
            </video>
         </div>
      </div>
   );
};