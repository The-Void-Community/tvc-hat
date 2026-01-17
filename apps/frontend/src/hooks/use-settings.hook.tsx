"use client";

import { DropdownItem, DropdownItemProps } from "tvuikit";
import { useModal } from "./use-modal.hook";
import { Settings } from "@/components/settings.component";

export const useSettings = () => {
  const { Modal, opened, toggleOpened } = useModal();

  const Trigger = ({
    children,
    onClick,
    ...props
  }: Partial<DropdownItemProps>) => {
    return (
      <DropdownItem
        onClick={(event) => {
          onClick?.(event);
          toggleOpened(true);
        }}
        {...props}
      >
        {children}
      </DropdownItem>
    );
  };

  const Component = () => {
    return (
      <Modal className="bg-(--bg-smooth-ce) p-24 h-full flex-center">
        <Settings />
      </Modal>
    );
  };

  return {
    opened,
    toggleOpened,
    SettingsModal: Component,
    SettingsTrigger: Trigger,
  };
};
