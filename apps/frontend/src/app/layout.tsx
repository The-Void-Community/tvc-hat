"use client";

import type { ReactNode } from "react";

import { Human } from "@/components/human.component";
import { HeaderLayout } from "@/layout/header.layout";
import { FooterLayout } from "@/layout/footer.layout";

import { usePathname } from "next/navigation";

import "tvuikit/index.css";
import "./globals.css";

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const pathname = usePathname();
  const noLayoutRoutes = ["/chat"];
  const hideLayout = noLayoutRoutes.some((r) => pathname.startsWith(r));

  if (hideLayout) {
    return (
      <html data-shiftshift-theme="system" lang="ru">
        <title>Hat</title>
        <meta name="description" content="The Void Chat" />
        <body>
          <div className="background"></div>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html data-shiftshift-theme="system" lang="ru">
      <title>Hat</title>
      <meta name="description" content="The Void Chat" />
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
