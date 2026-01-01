import type { ReactNode } from "react";

import { FaDiscord, FaGithub, FaTelegram } from "react-icons/fa";
import { SlGlobe } from "react-icons/sl";

import { Links } from "@/constants";

export const LogoComponent = ({
  links,
  children,
  id,
}: {
  links: Record<keyof typeof Links.fockusty, string>;
  children: ReactNode;
  id?: string;
}) => {
  return (
    <div id={id} className="flex flex-col">
      {children}

      <div className="flex flex-row gap-2 justify-between">
        <a href={links.discord_url} target="_blank">
          <FaDiscord size={24} />
        </a>
        <a href={links.telegram_url} target="_blank">
          <FaTelegram size={24} />
        </a>
        <a href={links.github_url} target="_blank">
          <FaGithub size={24} />
        </a>
        <a href={links.site} target="_blank">
          <SlGlobe size={24} />
        </a>
      </div>
    </div>
  );
};
