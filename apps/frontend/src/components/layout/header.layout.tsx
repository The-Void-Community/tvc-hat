"use client";

import { LogoComponent } from "@/components/logo.component";
import { Links, company } from "@/constants";

export const HeaderLayout = () => {
  return (
    <header>
      <LogoComponent links={Links.the_void}>
        <h1>{company}</h1>
      </LogoComponent>
    </header>
  );
};
