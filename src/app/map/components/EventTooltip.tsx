"use client";

import { InfoWindow } from "@react-google-maps/api";

import { Button } from "@/components/ui/button";
import type { LatLng, EventShow } from "@/lib/types/db";

function EventTooltip({
  event,
  position,
}: {
  event: EventShow;
  position: LatLng;
}) {
  return (
    <InfoWindow position={position}>
      <div>
        <p> Titie: {event.title} </p>
        <p> Description: {event.description} </p>
        <p> Start Time: {event.startTime.toLocaleDateString()} </p>
        <p> End Time: {event.endTime.toLocaleDateString()} </p>
        <a href={`/event/${event.id}`}>
          <Button>Go to event</Button>
        </a>
      </div>
    </InfoWindow>
  );
}

export default EventTooltip;
