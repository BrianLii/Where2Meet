"use client";

import { MarkerF } from "@react-google-maps/api";

import type { LatLng, EventShow } from "@/lib/types/db";

function MyMarker({
  event,
  setShowedEvent,
  setShowedEventPosition,
}: {
  event: EventShow;
  setShowedEvent: (event: EventShow | undefined) => void;
  setShowedEventPosition: (position: LatLng | undefined) => void;
}) {
  return (
    <MarkerF
      position={event.position}
      onMouseOver={() => {
        setShowedEvent(event);
        setShowedEventPosition(event.position);
      }}
    />
  );
}

export default MyMarker;
