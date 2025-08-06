"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type JoiningButtonProps = {
  joined: boolean;
  userId: string;
  eventId: number;
  createParticipation: (userId: string, eventId: number) => Promise<void>;
  deleteParticipation: (userId: string, eventId: number) => Promise<void>;
};

function JoiningButton({
  joined,
  createParticipation,
  deleteParticipation,
  userId,
  eventId,
}: JoiningButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleJoiningButtonClick = async () => {
    setLoading(true);
    if (joined) {
      await deleteParticipation(userId, eventId);
    } else {
      await createParticipation(userId, eventId);
    }
    router.refresh();
    setLoading(false);
  };
  return (
    <>
      <Button
        className="h-full w-full hover:bg-slate-600"
        onClick={handleJoiningButtonClick}
        disabled={loading}
      >
        {loading ? "Loading" : joined ? "Leave" : "Join"}
      </Button>
    </>
  );
}

export default JoiningButton;
