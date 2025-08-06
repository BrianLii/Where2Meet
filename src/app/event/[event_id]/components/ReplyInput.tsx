"use client";

import { useRef, useState } from "react";

import GrowingTextarea from "./GrowingTextarea";

//import { useRouter } from "next/navigation";

type ReplyInputProps = {
  eventId: number;
  userId: string;
  eventTitle: string;
  createReply: (
    eventId: number,
    userId: string,
    content: string,
  ) => Promise<void>; //(eventId: number, userId: string, content: string) => Promise<number>
  joined: boolean;
};

export default function ReplyInput({
  eventId,
  userId,
  createReply,
  joined,
}: ReplyInputProps) {
  //const router = useRouter();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    try {
      setLoading(true);
      await createReply(eventId, userId, content);
      setLoading(false);
      textareaRef.current.value = "";
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting reply");
    }
  };

  return (
    <div onClick={() => textareaRef.current?.focus()}>
      <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4">
        <GrowingTextarea
          ref={textareaRef}
          wrapperClassName="col-start-2 row-start-2"
          className="bg-transparent text-xl outline-none placeholder:text-gray-500"
          placeholder={
            joined
              ? loading
                ? "Recording the reply..."
                : "Leave some comment here..."
              : "User need to join the event before replying..."
          }
          handleReply={handleReply}
          disabled={!joined || loading}
          joined={joined}
        />
      </div>
    </div>
  );
}
