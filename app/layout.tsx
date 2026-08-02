import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PFVFORM — конструктор лицензионных договоров",
  description: "Заполните лицензионный договор PFVMUSIC и проверьте его в живом предпросмотре.",
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
