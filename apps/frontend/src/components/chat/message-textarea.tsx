import type { FormEvent, RefObject } from "react";

import { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";
import { Button, Textarea } from "tvuikit";

type Props = {
  onSubmit: (text: string) => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
};

export const MessageTextarea = ({ onSubmit, textareaRef }: Props) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e?: FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const text = value.trim();
    if (text === "") return;
    
    onSubmit(text);
    setValue("");
  };

  return (
    <form id="send-message" className="flex items-center gap-2" onSubmit={handleSubmit}>
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder="Ваше сообщение..."
          className={[
            "w-full max-w-none resize-none rounded-md bg-[#00000000] p-2 text-sm min-h-[40px]",
            "focus:outline-0",
          ].join(" ")}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || e.shiftKey) {
              return
            };
            
            e.preventDefault();
            handleSubmit(e);
          }}
        />
      </div>

      <Button type="submit" className="p-2 rounded-lg cursor-pointer" overwriteClassName>
        <HiPaperAirplane size={32} className="rotate-90" />
      </Button>
    </form>
  );
};
