import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import {
  foldersTable,
  chaptersTable,
  chapterParentsTable,
} from "../../../../db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { Value } from "@udecode/plate";
import { Emoji } from "@shared/models";

export const useFolderById = (
  id: number,
): UseQueryResult<
  | typeof foldersTable.$inferSelect
  | {
      description: Value;
      emoji: Emoji;
    },
  Error
> => {
  return useQuery({
    queryKey: ["folder", "single", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(foldersTable)
        .where(eq(foldersTable.id, id))
        .get();

      const chapters = await database
        .select({
          id: chaptersTable.id,
          name: chaptersTable.name,
        })
        .from(chaptersTable)
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            eq(chapterParentsTable.parent_type, "folder"),
            eq(chapterParentsTable.parent_id, id),
            isNull(chaptersTable.deleted_at),
          ),
        )
        .orderBy(chaptersTable.position);

      if (!result) {
        throw new Error(`Folder with id ${id} not found`);
      }

      return {
        ...result,
        description: deserialize(result.description),
        emoji: deserialize(result.emoji),
        chapters,
      };
    },
  });
};
