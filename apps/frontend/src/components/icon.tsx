"use client";

import type { Chat, User } from "@/types";
import Image from "next/image";

type Props = {
  entity?: User | Chat | string;
  size?: number;
};

const COLORS = [
  "bg-red-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-teal-400",
];

const getColorClass = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

const renderInitial = (char: string, key: string, size: number) => {
  const bgColor = getColorClass(key);
  return (
    <div
      className={[
        "noselect p-4 rounded-full flex-center",
        bgColor
      ].join(" ")}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        minHeight: `${size}px`,
        minWidth: `${size}px`,
      }}
    >
      {char.toUpperCase()}
    </div>
  );
};

export const IconOrAvatar = ({ entity, size = 40 }: Props) => {
  const renderImg = (src: string) => (
    <Image
      src={src}
      alt="icon"
      height={size}
      width={size}
      className="noselect rounded-full"
    />
  );

  if (typeof entity === "string") return renderInitial(entity[0], entity, size);

  if (!entity) return renderImg("/TheVoidAvatarSite.png");

  if ("icon" in entity && entity.icon) return renderImg(entity.icon);
  if ("avatar" in entity && entity.avatar) return renderImg(entity.avatar);

  const entityName = "name" in entity
    ? (entity.chatname || entity.name || "?unknown")
    : (entity.nickname || entity.username || "?unknown");

  return renderInitial(entityName[0], entityName, size);
};
