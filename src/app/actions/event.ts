import { db } from "@/db";
import { eventsTable, participationsTable } from "@/db/schema";
import type { Event, EventShow } from "@/lib/types/db";

export const getEvents = async () => {
  "use server";
  const events: EventShow[] = await db
    .select({
      id: eventsTable.id,
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
    .from(eventsTable);
  return events;
};

export const createEvent = async (userId: string, event: Event) => {
  "use server";

  console.log(event);

  const [newEvent] = await db
    .insert(eventsTable)
    .values({
      title: event.title,
      description: event.description,
      type: event.type,
      startTime: event.startTime,
      endTime: event.endTime,
      label: event.label,
      positionLat: event.position.lat,
      positionLng: event.position.lng,
    })
    .returning();

  await db.insert(participationsTable).values({
    userId,
    eventId: newEvent.id,
  });

  return newEvent.id;
};
