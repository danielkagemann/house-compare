interface Props {
   children: React.ReactNode;
   className?: string;
}

export const PageLayout = ({ children, className }: Props) => {
   return (
      <div className={`bg-white max-w-5xl w-full flex flex-col mx-auto p-4 ${className}`}>
         {children}
      </div>
   );
}