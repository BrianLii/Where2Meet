"use client";

import { useState, useEffect } from "react";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { LatLng, EventShow, User } from "@/lib/types/db";
import { type Event } from "@/lib/types/db";

import CreateDialog from "./CreateDialog";
import EventTooltip from "./EventTooltip";
import MyMarker from "./MyMaker";
import SearchBar from "./SearchBar";

function Map({
  events,
  currentUser,
  createEvent,
}: {
  events: EventShow[];
  currentUser: User;
  createEvent: (userId: string, event: Event) => Promise<number>;
}) {
  const [showedEvent, setShowedEvent] = useState<EventShow>();
  const [showedEventPosition, setShowedEventPosition] = useState<LatLng>();
  const [center, setCenter] = useState<LatLng>({
    lat: 25.019412,
    lng: 121.541618,
  }); // Der-Tien Building
  const [filteredEvents, setFilteredEvents] = useState<EventShow[]>([]);
  const [originalEvents, setOriginalEvents] = useState<EventShow[]>([]);

  useEffect(() => {
    setFilteredEvents(events);
    setOriginalEvents(events);
  }, [events]);

  // load script for google map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  if (!isLoaded) return <div>Loading....</div>;

  // get current location
  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("div");
    controlUI.innerHTML = "Go to your location";
    controlUI.style.backgroundColor = "white";
    controlUI.style.color = "black";
    controlUI.style.border = "2px solid #ccc";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.style.width = "100%";
    controlUI.style.padding = "8px 0";
    controlUI.addEventListener("click", handleGetLocationClick);
    controlDiv.appendChild(controlUI);
    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
      controlDiv,
    );
  };
  return (
    <div className="flex h-full">
      <div className="h-full w-1/2 flex-none">
        <GoogleMap
          zoom={18}
          center={center}
          mapContainerClassName="map"
          mapContainerStyle={{ width: "100%", height: "100%", margin: "auto" }}
          onLoad={onMapLoad}
        >
          {filteredEvents.map((event, index) => {
            return (
              <MyMarker
                key={index}
                event={event}
                setShowedEvent={setShowedEvent}
                setShowedEventPosition={setShowedEventPosition}
              />
            );
          })}
          {showedEvent && showedEventPosition && (
            <div>
              <EventTooltip
                event={showedEvent}
                position={showedEventPosition}
              />
            </div>
          )}
        </GoogleMap>
      </div>

      <div className="flex h-full w-full flex-col gap-2 p-2">
        <div className="h-12 w-full">
          <SearchBar
            setFilteredEvents={setFilteredEvents}
            originalEvents={originalEvents}
          />
        </div>
        <ScrollArea className="h-80 max-h-screen w-full border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Event lists (click to show location)
            </h4>
            {filteredEvents.map((event, index) => (
              <div key={index}>
                <Separator className="my-2" />
                <div
                  className="px-2 text-sm hover:bg-slate-200"
                  onClick={() =>
                    setCenter({
                      lat: event.position.lat,
                      lng: event.position.lng,
                    })
                  }
                >
                  <p> Title: {event.title} </p>
                  <p> Description: {event.description} </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <CreateDialog user={currentUser} createEvent={createEvent} />
      </div>
    </div>
  );
}

export default Map;
