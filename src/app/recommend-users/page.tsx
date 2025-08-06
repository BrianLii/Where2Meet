import getRecommendUsers from "@/app/actions/getRecommendUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import RecommendUsers from "./components/RecommendUsers";

async function RecommandUserPage() {
  const { currentUser: user } = await useCurrentUser();
  const recommendedUsers = await getRecommendUsers(user.id);
  return (
    <RecommendUsers userId={user.id} recommendedUsers={recommendedUsers} />
  );
}

export default RecommandUserPage;
