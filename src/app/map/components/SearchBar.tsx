"use clients";

import { useState } from "react";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { EventShow } from "@/lib/types/db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function SearchBar({
  setFilteredEvents,
  originalEvents,
}: {
  setFilteredEvents: (events: EventShow[]) => void;
  originalEvents: EventShow[];
}) {
  const [searchText, setSearchText] = useState("");

  const handleClick = () => {
    if (searchText !== "") {
      const events = originalEvents.filter((event) =>
        event.title.includes(searchText),
      );
      setFilteredEvents(events);
    } else {
      setFilteredEvents(originalEvents);
    }
    setSearchText("");
  };

  return (
    <>
      <div className="flex h-full w-full gap-2">
        <input
          className="grow rounded-md border px-2"
          type="text"
          placeholder="Search the name of the event..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="w-20 flex-none rounded-md text-center hover:bg-slate-200"
          onClick={handleClick}
        >
          Search
        </button>
      </div>
    </>
  );
}

export default SearchBar;
