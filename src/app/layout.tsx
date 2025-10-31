"use client";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { StorageProvider, useStorage } from "@/context/storage-provider";
import { Footer } from "@/components/Footer";

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
        <title>Villaya</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StorageProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" expand={true} richColors />
        </StorageProvider>
      </body>
    </html>
  );
}

