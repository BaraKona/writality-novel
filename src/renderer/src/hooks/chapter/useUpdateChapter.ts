import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import {
  chaptersTable,
  parentRelationshipsTable,
  dailyWordCountsTable,
} from "../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useUpdateChapter = (
  chapterParent?: typeof parentRelationshipsTable.$inferSelect,
): ReturnType<typeof useMutation> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      chapter: typeof chaptersTable.$inferSelect & {
        description: Value;
      },
    ) => {
      const newWordCount = chapter.word_count ?? 0;
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // Fetch previous chapter data
      const prevChapter = await database
        .select()
        .from(chaptersTable)
        .where(eq(chaptersTable.id, chapter.id))
        .get();

      if (prevChapter) {
        const prevWordCount = prevChapter.word_count ?? 0;
        const netChange = newWordCount - prevWordCount;

        // Update chapter
        await database
          .update(chaptersTable)
          .set({
            ...chapter,
            name: chapter.name,
            description: serialize(chapter.description),
          })
          .where(eq(chaptersTable.id, chapter.id))
          .run();

        // Update daily word count
        const existingEntry = await database
          .select()
          .from(dailyWordCountsTable)
          .where(
            and(
              eq(dailyWordCountsTable.chapter_id, chapter.id),
              eq(dailyWordCountsTable.date, today),
            ),
          )
          .get();

        if (existingEntry?.id) {
          console.log("Updating existing daily word count entry");
          await database
            .update(dailyWordCountsTable)
            .set({ word_count: existingEntry.word_count + netChange })
            .where(eq(dailyWordCountsTable.id, existingEntry.id))
            .run();
        } else {
          console.log("Creating new daily word count entry");
          await database
            .insert(dailyWordCountsTable)
            .values({
              chapter_id: chapter.id,
              date: today,
              word_count: newWordCount,
            })
            .run();
        }
      } else {
        // Handle case where previous chapter data is not found
        throw new Error("Previous chapter data not found.");
      }

      return chapter;
    },
    mutationKey: ["updateChapter"],
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["chapter", data.id],
        (prevData: typeof chaptersTable) => {
          return { ...prevData, name: data.name };
        },
      );
      if (chapterParent?.parent_type === "project") {
        queryClient.setQueryData(
          ["projects", "files", chapterParent?.parent_id],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prevData: any) => {
            return {
              ...prevData,
              chapters: prevData.chapters.map((chapter) => {
                if (chapter.id === data.id) {
                  return { ...chapter, name: data.name, emoji: data.emoji };
                }
                return chapter;
              }),
            };
          },
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", chapterParent?.parent_id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["chapter", data.id, "versions"],
      });
    },
  });
};
