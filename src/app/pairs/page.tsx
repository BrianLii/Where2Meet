import { redirect } from "next/navigation";

import { auth } from "auth";

import Pairs from "./components/Pairs";

async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const userId = session.user.id;

  return (
    <div>
      <Pairs userId={userId} />
    </div>
  );
}
export default UsagePage;
