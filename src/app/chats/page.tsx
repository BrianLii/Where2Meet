import { IoIosSearch } from "react-icons/io";

import { redirect } from "next/navigation";

import { auth } from "auth";

import { publicEnv } from "@/lib/env/public";

async function EmptyChatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <IoIosSearch className="text-yellow-500" size={75} />
        <p className="text-lg font-semibold text-slate-700">請選擇聊天室</p>
      </div>
    </div>
  );
}
export default EmptyChatPage;
