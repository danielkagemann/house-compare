"use client";

import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";
import "leaflet/dist/leaflet.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { useSearchParams } from "next/navigation";
import de from "../messages/de.json";
import en from "../messages/en.json";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute
      gcTime: 1 * 60 * 1000, // 1 minute (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on >= 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status <= 500) return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
})

interface ProviderProps {
  readonly children: React.ReactNode;
}

function Providers({ children }: ProviderProps) {
  const locale = useSearchParams().get('locale') || 'de';

  const messages = locale === 'de' ? de : en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" expand={true} richColors />
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <title>Villaya</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Suspense fallback={null}>
          <Providers>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
