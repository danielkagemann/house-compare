export const Features = ({ features }: { features: string[] }) => {
   return (
      <div className="flex flex-col items-start gap-0.5">
         {features.map((feature, index) => (
            <div key={`feature-${index}`} className="bg-primary py-1 px-2 text-xs rounded-full text-white">{feature}</div>
         ))}
      </div>
   );
};