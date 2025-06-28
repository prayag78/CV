import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarComponent } from "@/components/navbar";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { syncUser } from "@/actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CenCV",
  description: "CenCV is a platform for creating customized resumes with AI.",
};

export default async function RootLayout({children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if(user) await syncUser();

  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarComponent />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
