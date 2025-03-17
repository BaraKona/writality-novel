import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database, deserialize, serialize } from "@renderer/db";
import { chaptersTable, versionsTable } from "../../../../../db/schema";
import { and, eq, gt } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getWordCountFromRichContent } from "@renderer/lib/utils";

const VERSIONING_CONFIG = {
  MIN_TIME_BETWEEN_VERSIONS: 30 * 60, // 30 minutes in seconds
  MIN_WORD_COUNT_CHANGE: 100, // Minimum word count change to trigger a version
  MAX_MINOR_VERSIONS_TO_KEEP: 5, // Keep only the 5 most recent minor versions
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createVersion"],
    mutationFn: async ({
      chapterId,
      description,
      isMajorVersion = false,
    }: {
      chapterId: number;
      description: string;
      isMajorVersion?: boolean;
    }) => {
      // Get the current chapter
      const chapter = await database
        .select()
        .from(chaptersTable)
        .where(eq(chaptersTable.id, chapterId))
        .get();

      if (!chapter) {
        throw new Error("Chapter not found");
      }

      // Get the most recent version
      const lastVersion = await database
        .select()
        .from(versionsTable)
        .where(eq(versionsTable.chapter_id, chapterId))
        .orderBy(sql`${versionsTable.created_at} DESC`)
        .limit(1)
        .get();

      // Check if we should create a new version

      console.log("dsg");

      const shouldCreateVersion =
        isMajorVersion ||
        !lastVersion?.chapter_id ||
        shouldCreateNewVersion(lastVersion, description);

      if (!shouldCreateVersion) {
        console.log("No new version created");
        return null;
      }

      // Create new version
      const newVersion = await database
        .insert(versionsTable)
        .values({
          name: chapter.name,
          chapter_id: chapterId,
          description: serialize(description),
          word_count: chapter.word_count || 0,
          is_major_version: isMajorVersion ? 1 : 0,
        })
        .returning()
        .get();

      // Clean up old versions if this is a minor version
      if (!isMajorVersion) {
        await cleanupOldVersions(chapterId);
      }

      return newVersion;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["chapter", data.chapter_id, "versions"],
        });
      }
    },
  });
};

// Helper function to determine if we should create a new version
const shouldCreateNewVersion = (
  lastVersion: typeof versionsTable.$inferSelect,
  newContent: string,
): boolean => {
  const timeSinceLastVersion =
    Math.floor(Date.now() / 1000) - lastVersion.created_at;

  // Always create a version if enough time has passed
  if (timeSinceLastVersion >= VERSIONING_CONFIG.MIN_TIME_BETWEEN_VERSIONS) {
    return true;
  }

  // Compare content directly
  if (deserialize(lastVersion.description) !== newContent) {
    const oldWordCount = lastVersion.word_count;
    const newWordCount = getWordCountFromRichContent(newContent);
    const wordCountChange = Math.abs(newWordCount - oldWordCount);

    return wordCountChange >= VERSIONING_CONFIG.MIN_WORD_COUNT_CHANGE;
  }

  return false;
};

// Helper function to clean up old versions
const cleanupOldVersions = async (chapterId: number) => {
  // Get all minor versions ordered by creation date
  const minorVersions = await database
    .select()
    .from(versionsTable)
    .where(
      and(
        eq(versionsTable.chapter_id, chapterId),
        eq(versionsTable.is_major_version, 0),
      ),
    )
    .orderBy(sql`${versionsTable.created_at} DESC`)
    .all();

  // If we have more minor versions than we want to keep, delete the oldest ones
  if (minorVersions.length > VERSIONING_CONFIG.MAX_MINOR_VERSIONS_TO_KEEP) {
    const versionsToDelete = minorVersions.slice(
      VERSIONING_CONFIG.MAX_MINOR_VERSIONS_TO_KEEP,
    );
    await database
      .delete(versionsTable)
      .where(
        and(
          eq(versionsTable.chapter_id, chapterId),
          eq(versionsTable.is_major_version, 0),
          gt(versionsTable.created_at, versionsToDelete[0].created_at),
        ),
      )
      .run();
  }
};
