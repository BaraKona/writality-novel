import { useQuery } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { versionsTable } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export const useChapterVersions = (chapterId: number) => {
  return useQuery({
    queryKey: ["chapter", chapterId, "versions"],
    queryFn: async () => {
      const result = await database
        .select()
        .from(versionsTable)
        .where(eq(versionsTable.chapter_id, chapterId));

      if (!result) {
        throw new Error(`Chapter with id ${chapterId} not found`);
      }

      return result;
    },
    retry: false,
    enabled: !!chapterId,
  });
};
