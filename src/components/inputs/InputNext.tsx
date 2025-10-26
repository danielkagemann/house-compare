import { Button } from "../ui/button";

interface InputNextProps {
   onClick: () => void;
}

export const InputNext = ({ onClick }: InputNextProps) => {
   return (
      <div className="flex justify-end">
         <Button variant="link" onClick={onClick}>Nächster Schritt</Button>
      </div>
   );
}
