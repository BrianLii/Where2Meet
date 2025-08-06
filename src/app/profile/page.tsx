import Image from "next/image";

import { updateUser } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import ModifyDialog from "./components/ModifyDialog";
import UploadImageClient from "./components/UploadImageClient";
import { updateUserImage } from "./components/upload";

async function ProfilePage() {
  const { currentUser: user } = await useCurrentUser();
  console.log(user.image);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="top-0 flex h-60 items-center gap-5 break-all bg-zinc-100 px-2">
        <div className="relative h-48 w-48 flex-none overflow-hidden rounded-full">
          <Image
            src={user.image || "/images/placeholder.jpg"}
            alt="user-profile-picture"
            fill={true}
            priority={true}
            sizes="33vw"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="flex h-full flex-auto flex-col justify-center">
          <div className="flex h-20 items-center">
            <div className="flex-none text-4xl">{user.displayName}</div>
          </div>
          <div className="flex gap-5">
            <ModifyDialog user={user} updateUser={updateUser} />
            <UploadImageClient
              updateUserImage={updateUserImage}
              userId={user.id}
            />
          </div>
        </div>
      </div>
      <Card className="h-full flex-1 overflow-y-auto break-all rounded-none">
        <CardHeader className="py-2">
          <CardTitle className="text-xl">About me</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="px-6 pt-2">
          <CardTitle className="text-lg">Gender</CardTitle>
          <p>{user.gender}</p>
          <CardTitle className="text-lg">Height (cm)</CardTitle>
          <p>{user.height}</p>
          <CardTitle className="text-lg">Weight (kg)</CardTitle>
          <p>{user.weight}</p>
          <CardTitle className="text-lg">Biography</CardTitle>
          <p>{user.intro}</p>
        </CardContent>
      </Card>
    </div>
  );
}
export default ProfilePage;
