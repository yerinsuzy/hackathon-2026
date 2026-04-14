import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2026 Zero to Product | Company Hackathon Web Platform",
  description: "Join our annual hackathon event, vote for projects, and innovate together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col font-sans antialiased text-slate-900`}>
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="w-full border-t border-gray-200 bg-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} 2026 Zero to Product. Built for the company hackathon.</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
