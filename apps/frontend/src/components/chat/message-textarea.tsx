import type { FormEventHandler, RefObject, SetStateAction } from "react";

import { HiPaperAirplane } from "react-icons/hi";
import { Button, Textarea } from "tvuikit";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  setText: (text: SetStateAction<string>) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export const MessageTextarea = ({ onSubmit, setText, textareaRef }: Props) => {
  return (
    <form id="send-message" className="flex items-end gap-2" onSubmit={onSubmit}>
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder="Ваше сообщение..."
          className="w-full max-w-none resize-none rounded-md bg-[00000000] p-2 text-sm min-h-[40px]"
        />
      </div>

      <Button type="submit" className="p-2 rounded-md bg-(--accent) text-white" overwriteClassName>
        <HiPaperAirplane size={20} className="rotate-90" />
      </Button>
    </form>
  );
};
