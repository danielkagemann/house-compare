import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "House compare",
  description: "Häuser vergleichen von idealista und manuellen Einträgen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon-16x16.png`} />
        <link rel="manifest" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/site.webmanifest`} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
