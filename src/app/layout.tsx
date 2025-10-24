import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Provider";

const roboto = Roboto({
  weight: ["400", "700"], // Especifique os pesos que você vai usar
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gestão Colinas",
  description: "Gerenciamento atividades Colinas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${inter.variable} font-sans antialiased bg-gray-100 dark:bg-[#1F1F30]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
