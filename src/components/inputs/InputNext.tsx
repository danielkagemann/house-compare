import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

interface InputNextProps {
   onClick: () => void;
}

export const InputNext = ({ onClick }: InputNextProps) => {
   // hooks
   const t = useTranslations("input");

   return (
      <div className="flex justify-end">
         <Button variant="link" onClick={onClick}>{t("nextStep")}</Button>
      </div>
   );
}
