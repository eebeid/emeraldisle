import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emerald Isle Trip Manager",
  description: "Managed trip to Emerald Isle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
