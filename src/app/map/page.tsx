import Link from "next/link";

import { Divider } from "@mui/material";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { createEvent, getEvents } from "@/app/actions/event";
import { db } from "@/db";
import { participationsTable } from "@/db/schema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { EventShow } from "@/lib/types/db";

import Map from "./components/Map";

async function MapPage() {
  const { currentUser } = await useCurrentUser();
  const allEvents = await getEvents();

  const isJoined = async (userId: string, eventId: number) => {
    const joinedData = await db
      .select({
        id: participationsTable.id,
      })
      .from(participationsTable)
      .where(
        and(
          eq(participationsTable.eventId, eventId),
          eq(participationsTable.userId, userId),
        ),
      )
      .limit(1);
    return joinedData.length > 0;
  };

  const events: EventShow[] = [];
  for (const event of allEvents) {
    if (event.type === "public") {
      events.push(event);
    } else {
      const joined = await isJoined(currentUser.id, event.id);
      if (joined) events.push(event);
    }
  }

  return (
    <div className="flex h-screen max-h-screen w-full flex-col overflow-auto">
      <div className="flex h-10 flex-none items-center">
        <Link className="ml-4" href="/">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 text-center">
          <p className="my-3 text-center font-bold">Event Map</p>
        </div>
      </div>
      <Divider className="flex-none" />
      <div className="flex-auto">
        <Map
          events={events}
          currentUser={currentUser}
          createEvent={createEvent}
        />
      </div>
    </div>
  );
}
export default MapPage;
