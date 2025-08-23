import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "House compare",
  description: "Compare up to 3 houses listed by idealista",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
