import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import ConvexProvider from "@/providers/ConvexProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { MainNav } from "@/components/MainNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ne Yapsak",
  description: "Yapılacak aktiviteleri keşfet"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexProvider>
          <ToastProvider />
          <MainLayout>{children}</MainLayout>
        </ConvexProvider>
        <MainNav />
      </body>
    </html>
  );
}
