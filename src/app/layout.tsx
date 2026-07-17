import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Curso de Subdoshas",
  description:
    "Aprende los 15 subdoshas del Ayurveda (Vata, Pitta, Kapha) con lecciones interactivas estilo Duolingo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fredoka.variable} h-full antialiased`}>
      <body
        className="flex min-h-full flex-col text-[var(--foreground)]"
        style={{
          backgroundColor: "var(--background)",
          backgroundImage: "url('/images/background.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {children}
      </body>
    </html>
  );
}
