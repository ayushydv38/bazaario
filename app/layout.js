import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Bazaario — Har cheez, ek jagah",
  description:
    "Bazaario par kapde, electronics, ghar ka saaman aur roz ki zarooratein — sab ek hi jagah, seedha aapke ghar tak.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
