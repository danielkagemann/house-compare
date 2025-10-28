import { Input } from "../ui/input";
import { InputNext } from "./InputNext";

interface Props {
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}

export const InputImage = ({ value, onChange, onNext }: Props) => {
   const imageSrc = value || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/images/no-image.png`;

   const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
         const img = new Image();
         img.crossOrigin = "anonymous";
         img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL();
            resolve(base64);
         };
         img.onerror = () => reject(new Error('Image failed to load'));
         img.src = url;
      });
   };

   return (
      <>
         <p>Gib hier die URL zum Bild der Immobilie an. Eine kleine Vorschau wird angezeigt, sofern der Link korrekt ist, </p>

         <div className="flex gap-2 items-center">
            <img src={imageSrc}
               className="w-24 h-24 rounded-full object-cover" />
            <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
         </div>
         <InputNext onClick={onNext} />
      </>
   );
}