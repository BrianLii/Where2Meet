"use client";

import { useState, useEffect, useCallback } from "react";

import Link from "next/link";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Diversity1RoundedIcon from "@mui/icons-material/Diversity1Rounded";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import Card from "@/app/components/RecommendCard";
import SearchBar from "@/app/components/SearchBar";
import type { UserShow } from "@/lib/types/db";

function Pairs({ userId }: { userId: string }) {
  const [pairUsers, setPairUsers] = useState<UserShow[]>([]);
  const [keyword, setKeyword] = useState("");
  const filteredUsers = pairUsers.filter((user) =>
    (user.displayName || "").includes(keyword),
  );

  const fetchPairUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/pairs/?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pair users");
      }
      const data = await response.json();
      setPairUsers(data.pairUsers);
    } catch (error) {
      console.error("Error fetching pair users:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchPairUsers();
  }, [fetchPairUsers]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-10 items-center">
        <Link className="ml-4" href="/recommend-users">
          <ArrowBackIosRoundedIcon color="primary" />
        </Link>
        <div className="flex-1 text-center">
          <p className="my-3 text-center font-bold">
            My Pairs
            <IconButton>
              <Diversity1RoundedIcon sx={{ color: "#f472b6" }} />
            </IconButton>
          </p>
        </div>
      </div>
      <Divider />
      <div className="mx-auto mt-3 w-10/12">
        <SearchBar setKeyword={setKeyword} />
      </div>
      <div className="mt-3 flex w-full grow flex-wrap justify-center gap-5 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div key={user.id} className="h-96 w-44">
            <Card key={user.id} user={user} userId={userId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pairs;
