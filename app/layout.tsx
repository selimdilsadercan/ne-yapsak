import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileNavbar } from "@/components/navigation/MobileNavbar";
import { Sidebar } from "@/components/navigation/Sidebar";
import { ToastProvider } from "@/providers/ToastProvider";
import ConvexProvider from "@/providers/ConvexProvider";
import { SyncUser } from "@/components/auth/SyncUser";

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
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:pl-64">
              <div className="container mx-auto p-4 pb-20 md:pb-4">{children}</div>
            </main>
            <MobileNavbar />
          </div>
        </ConvexProvider>
      </body>
    </html>
  );
}
