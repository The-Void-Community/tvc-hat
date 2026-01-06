import type { FormEventHandler, RefObject, SetStateAction } from "react";

import { HiPaperAirplane } from "react-icons/hi";
import { Button, Textarea } from "tvuikit";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>,
  setText: (text: SetStateAction<string>) => void,
  textareaRef: RefObject<HTMLTextAreaElement|null>;
}

export const MessageTextarea = ({
  onSubmit,
  setText,
  textareaRef,
}: Props) => {
  return (
    <form
      id="send-message"
      className="send-message-form bg-(--bg-card) flex flex-row rounded-t-lg"
      onSubmit={onSubmit}
    >
      <Textarea
        ref={textareaRef}
        onChange={(e) => setText(e.currentTarget.value)}
        placeholder="Ваше сообщение..."
        className="send-message-form w-full max-w-none resize-none bg-[00000000] rounded-t-lg"
      />
      <Button
        type="submit"
        className="send-message-form cursor-pointer"
        overwriteClassName
      >
        <HiPaperAirplane size={48} className="rotate-90" />
      </Button>
    </form>
  )
}