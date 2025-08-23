import { useState } from "react"

type Props = {
   text: string;
};

const MAX_LENGTH = 300

export const ReadMore = ({ text }: Props) => {
   // state
   const [expanded, setExpanded] = useState<boolean>(false);

   if (text.length < MAX_LENGTH) {
      return <>{text}</>;
   }

   const show = expanded ? text : (text.slice(0, MAX_LENGTH) + '...');
   return (
      <>
         <p>{show}</p>
         <button type="button" onClick={() => setExpanded(p => !p)} className="cursor-pointer text-primary font-bold">{expanded ? 'weniger' : 'mehr'}</button>
      </>
   )
}