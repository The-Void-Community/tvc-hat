import { useEffect } from "react";
import { Active, Modal, ModalProps } from "tvuikit";
import { useToggleState } from "./use-toggle.hook";
import { v4 as uuid } from "uuid";

export const useModal = (initialProps?: Partial<ModalProps>) => {
  const [opened, toggleOpened] = useToggleState(false);
  const modalId = uuid();

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (!opened) {
        return;
      }
  
      if (!event.key) {
        return;
      }
  
      if (event.key.toLowerCase() === "escape") {
        toggleOpened(false);
      }
    };
  
    document.addEventListener("keydown", keydownListener);
    return () => {
      document.removeEventListener("keydown", keydownListener);
    };
  }, [toggleOpened, opened]);

  const Component = (props: Partial<ModalProps>) => {
    const {
      container = document.body,
      id,
      onClick,
      ...data
    } = {
      ...initialProps,
      ...props,
    }

    return (
      <Active actived={opened}>
        <Modal
          id={`${id || ""} ${modalId}`}
          container={container}
          onClick={(event) => {
            onClick?.(event);
            const targetId = (event.target as HTMLElement)?.id || "";
            if (!targetId.includes(modalId)) {
              return;
            }

            toggleOpened(false);
          }}
          {...data}
        />
      </Active>
    )
  }

  return {
    opened, 
    toggleOpened,
    Modal: Component
  }
}