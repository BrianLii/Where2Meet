import { redirect } from "next/navigation";

import { auth } from "auth";

import { getUser } from "@/app/actions/user";
import { publicEnv } from "@/lib/env/public";

export const useCurrentUser = async () => {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/api/auth/signin`);
  }
  const currentUser = await getUser(session.user.id);
  return { currentUser };
};
