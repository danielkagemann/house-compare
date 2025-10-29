"use client";

import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { StorageProvider } from "@/context/storage-provider";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={"/apple-touch-icon.png"} />
        <link rel="icon" type="image/png" sizes="32x32" href={"/favicon-32x32.png"} />
        <link rel="icon" type="image/png" sizes="16x16" href={"/favicon-16x16.png"} />
        <link rel="manifest" href={"/site.webmanifest"} />
        <title>House compare</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main className="h-screen grid grid-rows-[100px_1fr]">
          <Header />
          <div className="overflow-auto mb-16">
            {children}
          </div>
        </main>
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}


/*
<body>
        <main className="h-screen grid grid-rows-[100px_1fr]">
          <StorageProvider>
            <Header />
            <div className="overflow-auto mb-16">
              {children}
            </div>
          </StorageProvider>
        </main>
        <Toaster position="top-center" expand={true} richColors />
      </body>
      */
