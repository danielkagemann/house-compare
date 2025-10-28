export type FeatureList = {
   value: string;
   highlight: boolean;
};
type Props = {
   features: FeatureList[];
};

export const Features = ({ features }: Props) => {

   return (
      <div className="flex flex-col items-start gap-0.5">
         {features.map((feature, index) => (
            <div key={`feature-${index}`} className={`py-1 px-2 text-xs rounded-full ${feature.highlight ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
               {feature.value}
            </div>
         ))}
      </div>
   );
};