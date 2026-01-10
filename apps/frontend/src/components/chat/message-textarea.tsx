import type { FormEvent } from "react";

import { useChat } from "@/contexts/chat.context";

import { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";
import { Button, Textarea } from "tvuikit";

export const MessageTextarea = () => {
  const { onSubmit, textareaRef } = useChat();

  const [value, setValue] = useState("");

  const handleSubmit = (event?: FormEvent) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const text = value.trim();
    if (text === "") return;

    onSubmit(text);
    setValue("");
  };

  return (
    <form
      id="send-message"
      className="bg-(--bg-smooth-ce) rounded-lg flex items-center gap-2"
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        wrap="hard"
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="Ваше сообщение..."
        overwriteClassName
        className={[
          "w-full resize-none text-(length:--fs-mini)",
          "py-2 px-4 min-h-[56px] h-[56px] max-h-[280px]",
          "focus:outline-0"
        ].join(" ")}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey) {
            return;
          }

          event.preventDefault();
          handleSubmit(event);
        }}
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
