import type { Chat, User } from "@/types";
import Image from "next/image";

type IconOrAvatar =
  | {
      icon: string | null;
    }
  | {
      avatar: string | null;
    };

type Props = {
  entity?: User | Chat | string;
  size?: number;
};

const Img = (src: string, size: number) => {
  return (
    <Image
      height={size}
      width={size}
      src={src}
      alt="icon"
      className="rounded-full"
    />
  );
};

const FirstCharOfNameIcon = (char: string, size: number) => {
  return (
    <div
      className="bg-(--bg-smooth) p-4 rounded-full flex-center"
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      {char}
    </div>
  );
};

export const IconOrAvatar = ({ entity, size = 40 }: Props) => {
  if (typeof entity === "string") {
    return FirstCharOfNameIcon(entity[0], size);
  }

  if (!entity) {
    return Img("/TheVoidAvatarSite.png", size);
  }

  if ("icon" in entity && entity.icon) {
    return Img(entity.icon, size);
  }

  if ("avatar" in entity && entity.avatar) {
    return Img(entity.avatar, size);
  }

  return FirstCharOfNameIcon(
    ("name" in entity
      ? entity.chatname || entity.name
      : entity.nickname || entity.username)[0],
    size,
  );
};
