import { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
   id: number;
   message: string;
};

type ToastContextType = {
   showToast: (msg: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
   const [toasts, setToasts] = useState<Toast[]>([]);

   const showToast = (msg: string, duration = 4000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: msg }]);

      setTimeout(() => {
         setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
   };

   return (
      <ToastContext.Provider value={{ showToast }}>
         {children}

         <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((toast) => (
               <div
                  key={toast.id}
                  className="bg-black/90 text-white px-8 py-4 rounded-lg shadow-lg animate-fade-in"
               >
                  {toast.message}
               </div>
            ))}
         </div>
      </ToastContext.Provider>
   );
}

export function useToast() {
   const ctx = useContext(ToastContext);
   if (!ctx) throw new Error("useToast muss im ToastProvider verwendet werden");
   return ctx;
}