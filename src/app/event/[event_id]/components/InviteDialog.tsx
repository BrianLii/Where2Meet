"use client";

import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import InvitingButton from "./InvitingButton";

export type UserBasic = {
  id: string;
  name: string | null;
  image: string | null;
};

type InviteDialogProps = {
  eventId: number;
  userId: string;
  usersNotInEvent: UserBasic[];
  createParticipation: (userId: string, eventId: number) => Promise<void>;
};

function InviteDialog({
  eventId,
  userId,
  usersNotInEvent,
  createParticipation,
}: InviteDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [usersCanInvite, setUsersCanInvite] = useState<UserBasic[]>([]);

  const fetchUsersCanInvite = useCallback(async () => {
    try {
      const filteredUsersNotInEvent: UserBasic[] = [];
      for (const user of usersNotInEvent) {
        //console.log("user");
        //console.log(user);
        const response = await fetch(
          `/api/islike?likerId=${userId}&likedId=${user.id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch islike status");
        }
        const data = await response.json();
        //console.log("data");
        //console.log(data);
        const response2 = await fetch(
          `/api/islike?likerId=${user.id}&likedId=${userId}`,
        );
        if (!response2.ok) {
          throw new Error("Failed to fetch islike status");
        }
        const data2 = await response2.json();
        //console.log("data2");
        //console.log(data2);
        if (data.isLike && data2.isLike) {
          filteredUsersNotInEvent.push(user);
        }
      }

      //console.log("filteredUsersNotInEvent");
      //console.log(filteredUsersNotInEvent);
      setUsersCanInvite(filteredUsersNotInEvent);
    } catch (error) {
      console.error("Error fetching users that can be invited:", error);
    }
  }, [userId, usersNotInEvent]);

  useEffect(() => {
    //console.log("usersNotInEvent");
    //console.log(usersNotInEvent);
    fetchUsersCanInvite();
  }, [fetchUsersCanInvite]);

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
      <DialogTrigger asChild>
        <Button className="h-full w-full hover:bg-slate-600">Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite other user</DialogTitle>
          <DialogDescription>Invite other user to this event</DialogDescription>
        </DialogHeader>
        {usersCanInvite.map((userCanInvite, index) => {
          return (
            <div key={index} className="flex flex-row gap-4">
              <p>{userCanInvite.name}</p>
              <InvitingButton
                userId={userCanInvite.id}
                eventId={eventId}
                createParticipation={createParticipation}
                setDialogOpen={setDialogOpen}
                usersCanInvite={usersCanInvite}
                setUsersCanInvite={setUsersCanInvite}
              />
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}

export default InviteDialog;
