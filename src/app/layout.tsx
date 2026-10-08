import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PriceTicker from "@/components/PriceTicker";
import { getProducts } from "@/lib/api";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজার মূল্য",
  description:
    "বাংলাদেশের দৈনিক বাজার দর দেখুন। প্রয়োজনীয় পণ্যের আজকের দাম এক নজরে।",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getProducts();

  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Navbar />

        {/* Price ticker must stay directly below Navbar */}
        <PriceTicker products={products} />

        {children}

        <Footer />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "14px",
              fontFamily: "inherit",
            },
          }}
        />
      </body>
    </html>
  );
}