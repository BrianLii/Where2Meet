import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users as usersTable } from "@/db/schema";

export const updateUserImage = async (userId: string, imagUrl: string) => {
  "use server";
  await db
    .update(usersTable)
    .set({
      image: imagUrl,
    })
    .where(eq(usersTable.id, userId));
};
