import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Лицензионный договор — заполнение",
  description: "Заполните лицензионный договор Dream Motion и проверьте его в предпросмотре.",
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
