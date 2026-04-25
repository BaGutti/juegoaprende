import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgresoProvider } from "@/lib/progreso";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JuegoCódigo - Aprende programación para Arduino",
  description:
    "Aprende los fundamentos de programación de manera divertida con puzzles interactivos, preparándote para Arduino.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistMono.variable} font-mono antialiased`}>
        <ProgresoProvider>{children}</ProgresoProvider>
      </body>
    </html>
  );
}
