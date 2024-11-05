import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import "./globals.css";
import StoreProvider from "./StoreProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media App",
  description: "A platform for social media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>

        <StoreProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </StoreProvider>

      </body>
    </html>
  );
}




