import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KaryerAI",
  description: "KaryerAI helps you practice smarter with AI-powered mock interviews.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8880385119289443"
            crossOrigin="anonymous"
          />
          {/* Google Analytics Script */}
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-EX6CJQSZY"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EX6CJQSZY4');
            `}
          </Script>
        </head>
        <body className={inter.className}>
          <Toaster richColors position="top-right" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
