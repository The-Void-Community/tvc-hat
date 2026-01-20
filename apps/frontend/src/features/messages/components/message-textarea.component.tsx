import type { FormEvent, KeyboardEvent } from "react";

import { useMessages } from "../messages.context";
import { TextareaFormIds } from "../enums/message-textarea.enums";

import { Button, Textarea } from "tvuikit";
import { HiPaperAirplane } from "react-icons/hi";

export const MessageTextarea = () => {
  const { textareaRef, onTextareaSubmit } = useMessages();

  const handleSubmit = (event: FormEvent) => {
    if (!textareaRef.current) {
      throw new Error("textarea not found");
    }

    event.preventDefault();

    const { value } = textareaRef.current;
    const text = value.trim();
    if (!text) {
      return;
    }

    textareaRef.current.value = "";
    onTextareaSubmit(text);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    handleSubmit(event);
  };

  return (
    <form
      id={TextareaFormIds.form}
      className="bg-(--bg-smooth-ce) rounded-lg flex items-center gap-2"
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={textareaRef}
        wrap="hard"
        placeholder="Ваше сообщение"
        className={[
          "w-full resize-none text-(length:--fs-mini)",
          "py-2 px-4 min-h-[56px] h-[56px] max-h-[280px]" /* пофиксить высоту */,
          "focus:outline-0",
        ].join(" ")}
        overwriteClassName
        onKeyDown={handleKeyDown}
      />

      <Button
        type="submit"
        className="p-2 rounded-lg cursor-pointer"
        overwriteClassName
      >
        <HiPaperAirplane size={32} className="rotate-90" />
      </Button>
    </form>
  );
};
