import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "QuickCompare India",
  description: "An interactive dashboard comparing India's four quick-commerce apps",
};

import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NuqsAdapter>
            <TooltipProvider>
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </TooltipProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
