import Link from "next/link";

import GroupIcon from "@mui/icons-material/Group";
import Divider from "@mui/material/Divider";

import { useCurrentUser } from "@/hooks/useCurrentUser";

async function Navbar() {
  const { currentUser } = await useCurrentUser();
  const longCustomizedClassName =
    "w-full hover:bg-slate-200 hover:bg-accent hover:text-accent-foreground flex items-start pl-4 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
  return (
    <div className="h-full p-2 pt-0">
      <div className="flex h-10 items-center py-2">
        <div className="flex-1 text-center">
          <Link className="" href={"/"}>
            <p className="my-3 text-center font-bold hover:bg-slate-200">
              <GroupIcon sx={{ color: "#e11d48" }} /> Where to Meet
            </p>
          </Link>
        </div>
      </div>
      <Divider />
      <div className="mt-2 flex h-full flex-col gap-2 overflow-y-auto">
        <Link href={`/profile`}>
          <div className={longCustomizedClassName}>My profile</div>
        </Link>
        <Divider />
        <Link href={`/recommend-users`}>
          <div className={longCustomizedClassName}>Recommend Users</div>
        </Link>
        <Link href={`/pairs`}>
          <div className={longCustomizedClassName}>Paired Users</div>
        </Link>
        <Link href={`/likes`}>
          <div className={longCustomizedClassName}>Liked Users</div>
        </Link>
        <Link href={`/dislikes`}>
          <div className={longCustomizedClassName}>Disliked Users</div>
        </Link>
        <Divider />
        <Link href={`/map`}>
          <div className={longCustomizedClassName}>Maps</div>
        </Link>
        <Divider />
        <Link href={`/api/auth/signout`}>
          <div className={longCustomizedClassName}>Sign Out</div>
        </Link>
        <Divider />
        <div className="mx-4 h-10 break-all text-slate-700">
          <div>Logged in as:</div>
          <div>{currentUser.email}</div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
