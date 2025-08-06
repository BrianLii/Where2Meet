"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import type { UserBasic } from "./InviteDialog";

type InvitingButtonProps = {
  userId: string;
  eventId: number;
  createParticipation: (userId: string, eventId: number) => Promise<void>;
  setDialogOpen: (dialogOpen: boolean) => void;
  usersCanInvite: UserBasic[];
  setUsersCanInvite: (usersCanInvite: UserBasic[]) => void;
};

function InvitingButton({
  createParticipation,
  userId,
  eventId,
  setDialogOpen,
  usersCanInvite,
  setUsersCanInvite,
}: InvitingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleJoiningButtonClick = async () => {
    setLoading(true);

    await createParticipation(userId, eventId);

    setUsersCanInvite(
      usersCanInvite.filter((userCanInvite) => userCanInvite.id !== userId),
    );
    setDialogOpen(false);

    router.refresh();

    setLoading(false);
  };
  return (
    <>
      <Button
        className="hover:bg-slate-200"
        onClick={handleJoiningButtonClick}
        disabled={loading}
      >
        {loading ? "Loading" : "Invite"}
      </Button>
    </>
  );
}

export default InvitingButton;
