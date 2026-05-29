import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserHeader from "@/components/UserHeader/UserHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SweetStock",
  description: "Administración de inventario y ventas para dulcerías con Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <UserHeader />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

