import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

import "@uploadthing/react/styles.css";

import Navbar from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meeting",
  description: "Web Programming 2023 Final Project",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <main className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
            <nav className="flex w-1/3 flex-col border-r bg-slate-100">
              <Navbar />
            </nav>
            <div className="w-full overflow-y-auto">{children}</div>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
