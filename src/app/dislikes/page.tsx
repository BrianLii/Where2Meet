import { useCurrentUser } from "@/hooks/useCurrentUser";

import Dislikes from "./components/Dislikes";

async function UsagePage() {
  const { currentUser } = await useCurrentUser();
  return <Dislikes userId={currentUser.id} />;
}
export default UsagePage;
