import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DM/LM — лицензионный договор",
  description: "Строгий интерфейс заполнения лицензионного договора.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
