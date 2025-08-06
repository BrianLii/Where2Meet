"use client";

import { useRef } from "react";

import { Input } from "@/components/ui/input";
import type { UserMessage } from "@/lib/types/generic";

export default function Messages({
  sendMessage,
}: {
  sendMessage: (message: UserMessage) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-auto w-full p-4">
      <Input
        className="w-full"
        placeholder="請輸入留言"
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key == "Enter" && inputRef.current) {
            sendMessage({ content: inputRef.current.value });
            inputRef.current.value = "";
          }
        }}
      />
    </div>
  );
}
