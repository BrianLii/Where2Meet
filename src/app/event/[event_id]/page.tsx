import Link from "next/link";
import { redirect } from "next/navigation";

import EventIcon from "@mui/icons-material/Event";
import { Divider } from "@mui/material";
import { eq, and } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import {
  createParticipation,
  deleteParticipation,
} from "@/app/actions/participation";
import { db } from "@/db";
import { eventsTable, participationsTable, users } from "@/db/schema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Event } from "@/lib/types/db";

import EventChatroom from "./components/EventChatroom";
import InviteDialog from "./components/InviteDialog";
import type { UserBasic } from "./components/InviteDialog";
import JoiningButton from "./components/JoiningButton";
import TimeText from "./components/TimeText";

type eventPageProps = {
  params: {
    event_id: string;
  };
};

async function EventPage({ params: { event_id } }: eventPageProps) {
  const { currentUser } = await useCurrentUser();
  const event_id_num = parseInt(event_id);
  if (isNaN(event_id_num)) {
    redirect("/");
  }

  const [eventData]: Event[] = await db
    .select({
      title: eventsTable.title,
      description: eventsTable.description,
      type: eventsTable.type,
      startTime: eventsTable.startTime,
      endTime: eventsTable.endTime,
      label: eventsTable.label,
      position: {
        lat: eventsTable.positionLat,
        lng: eventsTable.positionLng,
      },
    })
    .from(eventsTable)
    .where(eq(eventsTable.id, event_id_num))
    .limit(1);

  if (!eventData) {
    redirect("/");
  }

  const allUserBasic = await db
    .select({
      id: users.id,
      name: users.displayName,
      image: users.image,
    })
    .from(users);
  let usersNotInEvent: UserBasic[] = [];
  allUserBasic.forEach(async (userBasic: UserBasic) => {
    const query = await db
      .select({
        id: participationsTable.id,
      })
      .from(participationsTable)
      .where(
        and(
          eq(participationsTable.userId, userBasic.id),
          eq(participationsTable.eventId, event_id_num),
        ),
      )
      .limit(1);
    if (query.length === 0) {
      usersNotInEvent = [...usersNotInEvent, userBasic];
    }
  });

  const joinedData = await db
    .select({
      id: participationsTable.id,
    })
    .from(participationsTable)
    .where(
      and(
        eq(participationsTable.eventId, event_id_num),
        eq(participationsTable.userId, currentUser.id),
      ),
    )
    .limit(1);

  const joined: boolean = joinedData.length > 0;

  return (
    <>
      <div className="flex h-screen w-full flex-col overflow-auto">
        <div className="flex h-10 items-center">
          <Link className="ml-4" href="/">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1 text-center">
            <p className="my-3 text-center font-bold">
              Event <EventIcon sx={{ color: "#3d91f2" }} />
            </p>
          </div>
        </div>
        <Divider />
        <div className="my-2 flex items-center gap-4 px-4">
          <div className="grow text-xl font-medium">
            {" "}
            Event name: {eventData.title}{" "}
          </div>
          <div className="h-10 w-20">
            {(eventData.type === "public" || joined) && (
              <JoiningButton
                joined={joined}
                createParticipation={createParticipation}
                deleteParticipation={deleteParticipation}
                userId={currentUser.id}
                eventId={event_id_num}
              />
            )}
          </div>
          <div className="h-10 w-20">
            {joined && (
              <InviteDialog
                eventId={event_id_num}
                userId={currentUser.id}
                usersNotInEvent={usersNotInEvent}
                createParticipation={createParticipation}
              />
            )}
          </div>
        </div>
        <div className="mb-2 flex items-center gap-4 px-4">
          <time className="block text-sm text-gray-500">
            From:{" "}
            <TimeText date={eventData.startTime} format="h:mm A · D MMM YYYY" />
          </time>
          <time className="block text-sm text-gray-500">
            To:{" "}
            <TimeText date={eventData.endTime} format="h:mm A · D MMM YYYY" />
          </time>
          {eventData.label !== "" && (
            <div className="ml-auto w-20 rounded-md border-2 text-center">
              {eventData.label}
            </div>
          )}
        </div>
        <EventChatroom
          eventId={event_id_num}
          userId={currentUser.id}
          eventTitle={eventData.title}
          joined={joined}
        />
      </div>
    </>
  );
}

export default EventPage;
