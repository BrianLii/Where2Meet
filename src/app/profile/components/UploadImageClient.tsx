"use client";

import { useRouter } from "next/navigation";

import { UploadButton } from "@/utils/uploadthing";

export default function UploadImageClient({
  userId,
  updateUserImage,
}: {
  updateUserImage: (userId: string, imagUrl: string) => Promise<void>;
  userId: string;
}) {
  const router = useRouter();
  return (
    <>
      <UploadButton
        appearance={{
          button:
            "h-11 w-36 bg-zinc-100 hover:bg-zinc-200 border-2 text-black ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-md bg-none after:bg-blue-400 ",
        }}
        content={{
          button: <div>Profile Image</div>,
        }}
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          try {
            const imgUrl = res[0].url;
            await updateUserImage(userId, imgUrl);
            router.push("/profile");
          } catch (error) {
            console.log("[onClientUploadComplete] Error", error);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
}
