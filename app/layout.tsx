import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexProvider from "@/providers/ConvexProvider";
import { UserSync } from "@/components/auth/UserSync";
import { Toaster } from "react-hot-toast";

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
          <Toaster />
          <UserSync />
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
