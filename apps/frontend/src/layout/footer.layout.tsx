"use client";

import { company, yearOfStart } from "@/constants";

export const FooterLayout = () => {
  return <footer>© {yearOfStart}-{new Date().getFullYear()} {company}</footer>;
};
