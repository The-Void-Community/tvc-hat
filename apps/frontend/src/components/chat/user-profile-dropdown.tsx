"use client";

import type { User } from "@/types";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "tvuikit";
import { IconOrAvatar } from "./icon";

import { HiCog } from "react-icons/hi";
import { useSettings } from "@/hooks/use-settings.hook";

type UserProfileDropdownProps = {
  user: User;
};

export const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const { SettingsModal, SettingsTrigger } = useSettings();

  return (
    <>
      <Dropdown defaultVertialPosition="top" menuAlign="left">
        <DropdownTrigger
          overwriteClassName
          className={[
            "cursor-pointer w-full rounded-lg min-h-[40px]",
            "hover:bg-(--bg-smooth-light) duration-200",
          ].join(" ")}
        >
          <div className="bg-(--bg-card) py-2 px-2 rounded-lg flex items-center gap-2">
            <IconOrAvatar entity={user} size={40} />
            <span className="truncate max-w-48">
              {user.nickname || user.username}
            </span>
          </div>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>{user.nickname}</DropdownItem>
          <DropdownItem
            onClick={() => {
              navigator.clipboard.writeText(user.username);
            }}
          >
            Скопировать имя пользователя
          </DropdownItem>
          <SettingsTrigger className="flex flex-row gap-2">
            <HiCog size={24} />
            <span>Настройки</span>
          </SettingsTrigger>
        </DropdownMenu>
      </Dropdown>

      <SettingsModal />
    </>
  );
};
