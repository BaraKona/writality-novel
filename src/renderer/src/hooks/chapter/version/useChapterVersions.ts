import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { versionsTable } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useChapterVersions = (
  chapterId: number,
): UseQueryResult<
  (typeof versionsTable.$inferSelect & { description: Value })[],
  Error
> => {
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

      return result.map((version) => ({
        ...version,
        description: deserialize(version.description),
      }));
    },
    retry: false,
    enabled: !!chapterId,
  });
};
