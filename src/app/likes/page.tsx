import { useCurrentUser } from "@/hooks/useCurrentUser";

import Likes from "./components/Likes";

async function UsagePage() {
  const { currentUser } = await useCurrentUser();
  return <Likes userId={currentUser.id} />;
}
export default UsagePage;
