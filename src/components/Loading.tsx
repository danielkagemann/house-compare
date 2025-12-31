import Image from "next/image";

export const Loading = () => {
   return (
      <div className="flex justify-center items-center w-full h-screen gap-2">
         <Image src="/assets/images/main-logo.webp" width={40} height={40} alt="logo" />
         <div className="flex flex-col gap-0">
            <div className="text-lg font-bold">Villaya</div>
         </div>
      </div>);
}
   ;