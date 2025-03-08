import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import ConvexProvider from "@/providers/ConvexProvider";
import { MainLayout } from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ne Yapsak?",
  description: "Plan activities with friends"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexProvider>
          <ToastProvider />
          <MainLayout>{children}</MainLayout>
        </ConvexProvider>
      </body>
    </html>
  );
}
