import { useState } from "react";
import { Input } from "../ui/input";
import { InputNext } from "./InputNext";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Endpoints } from "@/lib/fetch";

interface Props {
   value: string;
   onChange: (value: string) => void;
   onNext: () => void;
}

export const InputImage = ({ value, onChange, onNext }: Props) => {
   const imageSrc = value || '/assets/images/main-bg.webp';
   const [link, setLink] = useState<string>(value);

   async function onPaste(event: React.ClipboardEvent<HTMLInputElement>) {
      const items = event.clipboardData.items;
      for (const item of items) {
         if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            if (file) {
               const reader = new FileReader();
               reader.onload = function (e) {
                  const base64Image = e.target?.result as string;
                  resizeBase64Image(base64Image).then((resizedImage) => {
                     onChange(resizedImage);
                  }).catch(() => {
                     onChange(base64Image);
                  });
               };
               reader.readAsDataURL(file);
            }
         }
      }
   }

   async function resizeBase64Image(base64: string, width: number = 800): Promise<string> {
      return new Promise((resolve, reject) => {
         const img = new Image();
         img.src = base64;
         img.onload = () => {
            // If original image is smaller than target width, return original
            if (img.width <= width) {
               resolve(base64);
               return;
            }

            const canvas = document.createElement('canvas');
            const scale = width / img.width;
            canvas.width = width;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas context not available'));

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
         };
         img.onerror = reject;
      });
   }

   async function onCheckLink() {
      const response = await Endpoints.imageProxy(link);
      try {
         const converted = await resizeBase64Image(response);
         onChange(converted);
      } catch {
         onChange(response);
      }
   }

   return (
      <>
         <div className="flex gap-2 items-start">
            <img src={imageSrc}
               alt="Vorschaubild"
               className="w-24 h-24 rounded-xl object-cover" />
            <div>Du kannst hier das Bild über eine URL oder aus der Zwischenablage hinzufügen. Es wird intern eine Kopie gespeichert.<br />
               <Button variant="outline" onClick={() => onChange('')}><Trash size={18} /></Button></div>
         </div>
         <div className="flex flex-col gap-1 mt-4">
            <div className="flex gap-1">
               <Input type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Link einfügen..."
                  className="w-full" />
               <Button variant="outline" onClick={onCheckLink}>Prüfen</Button>
            </div>
            <p>Alternativ kannst Du auch ein Bild aus der Zwischenablage einfügen. </p>
            <Input placeholder="Hier Bild aus Zwischenablage einfügen..." onPaste={onPaste} />

         </div>
         <InputNext onClick={onNext} />
      </>
   );
}