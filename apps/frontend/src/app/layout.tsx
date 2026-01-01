import type { ReactNode } from "react";
import type { Metadata } from "next";

import { Human } from "@/components/human.component";
import { HeaderLayout } from "@/layout/header.layout";
import { FooterLayout } from "@/layout/footer.layout";

import "./globals.css";

export const metadata: Metadata = {
  title: "Markdown Редактор",
  description: "Онлайн редактор Markdown с реальным предпросмотром",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html data-shiftshift-theme="system" lang="ru">
      <body>
        <div className="background"></div>
        <Human />

        <HeaderLayout />

        <main>{children}</main>

        <FooterLayout />
      </body>
    </html>
  );
};

export default RootLayout;
