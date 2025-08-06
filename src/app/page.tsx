import Image from "next/image";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default async function Index() {
  const { currentUser } = await useCurrentUser();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-80 w-full flex-none justify-center overflow-hidden p-10">
        <div className="relative h-64 w-64 flex-none overflow-hidden">
          <Image
            src="/images/app-logo.png"
            alt="logo"
            fill={true}
            priority={true}
            sizes="50vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className="mx-auto w-3/4 text-center">
        <div className="text-4xl">Welcome, {currentUser.displayName}!</div>
        <div className="text-xl">
          Explore additional features by navigating the navigation bar on the
          left hand side.
        </div>
      </div>
    </div>
  );
}
