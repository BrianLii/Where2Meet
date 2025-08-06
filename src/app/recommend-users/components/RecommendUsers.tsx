"use client";

import { useState } from "react";
import Carousel from "react-material-ui-carousel";

import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import Card from "@/app/components/RecommendCard";
import SearchBar from "@/app/components/SearchBar";
import type { UserShow } from "@/lib/types/db";

import Menu from "./Menu";

type RecommendUsersProps = {
  userId: string;
  recommendedUsers: UserShow[];
};

const labelList = ["female", "male", "other"];

function RecommendUsers(props: RecommendUsersProps) {
  const { userId, recommendedUsers } = props;
  const [keyword, setKeyword] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labelList);
  const filteredUsers = recommendedUsers.filter(
    (user) =>
      (user.displayName || "").includes(keyword) &&
      selectedLabels.includes(user.gender || ""),
  );
  const handleToggleLabel = (toggleLabel: string) => {
    if (selectedLabels.includes(toggleLabel)) {
      setSelectedLabels(
        selectedLabels.filter((label) => label !== toggleLabel),
      );
    } else {
      setSelectedLabels([...selectedLabels, toggleLabel]);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-10 flex-none items-center">
        <div className="flex-1 text-center">
          <p className="my-3 text-center font-bold">
            Recommend Users
            <IconButton aria-label="group">
              <Groups2RoundedIcon color="primary" />
            </IconButton>
          </p>
        </div>
        <Menu />
      </div>
      <Divider />
      <div className="mx-auto mt-3 w-10/12">
        <SearchBar setKeyword={setKeyword} />
        <div className="mx-auto mt-3 flex w-10/12 w-full flex-wrap gap-2">
          {labelList.map((label) => (
            <Chip
              key={label}
              label={label}
              onClick={() => handleToggleLabel(label)}
              color="primary"
              variant={selectedLabels.includes(label) ? undefined : "outlined"}
            />
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <p className="mt-4 text-xl">No recommended user to display.</p>
        )}
      </div>
      <div className="mx-auto mt-3 w-96 overflow-y-auto text-4xl">
        <Carousel autoPlay={false} indicators={false}>
          {filteredUsers.map((user, index) => (
            <Card key={index} user={user} userId={userId} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default RecommendUsers;
