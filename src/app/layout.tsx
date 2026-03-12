import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Forum, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const forum = Forum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-forum",
});

const dmSans = DM_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "DigiKarte – Menu digital",
  description: "Créez et gérez vos menus digitaux avec codes QR",
  icons: {
    icon: "/digikarte-favicon.png",
    apple: "/digikarte-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${forum.variable} ${dmSans.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
