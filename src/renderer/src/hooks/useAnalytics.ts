import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  chaptersTable,
  dailyWordCountsTable,
  chapterParentsTable,
  foldersTable,
} from "../../../db/schema";
import { eq, and, count, sum, isNull, inArray, or, sql } from "drizzle-orm";

// Hook to fetch chapter word counts
export const useChapterWordCounts = (
  projectId: number,
): UseQueryResult<Array<{ name: string; wordCount: number }>, Error> => {
  return useQuery({
    queryKey: ["chapterWordCounts", projectId],
    queryFn: async () => {
      // Get all chapters that belong to this project (including nested ones)
      const chapters = await database
        .select()
        .from(chaptersTable)
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            or(
              and(
                eq(chapterParentsTable.parent_type, "project"),
                eq(chapterParentsTable.parent_id, projectId),
              ),
              and(
                eq(chapterParentsTable.parent_type, "folder"),
                inArray(
                  chapterParentsTable.parent_id,
                  database
                    .select({ id: foldersTable.id })
                    .from(foldersTable)
                    .where(eq(foldersTable.project_id, projectId)),
                ),
              ),
            ),
            isNull(chaptersTable.deleted_at),
          ),
        );

      return chapters.map((chapter) => ({
        name: chapter.chapters.name,
        wordCount: chapter.chapters.word_count,
      }));
    },
  });
};

// Hook to fetch daily word counts
export const useDailyWordCounts = (
  projectId: number,
): UseQueryResult<Array<{ date: string; count: number }>, Error> => {
  return useQuery({
    queryKey: ["dailyWordCounts", projectId],
    queryFn: async () => {
      const wordCounts = await database
        .select({
          date: dailyWordCountsTable.date,
          count: sum(dailyWordCountsTable.word_count),
        })
        .from(dailyWordCountsTable)
        .innerJoin(
          chaptersTable,
          eq(dailyWordCountsTable.chapter_id, chaptersTable.id),
        )
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            or(
              and(
                eq(chapterParentsTable.parent_type, "project"),
                eq(chapterParentsTable.parent_id, projectId),
              ),
              and(
                eq(chapterParentsTable.parent_type, "folder"),
                inArray(
                  chapterParentsTable.parent_id,
                  database
                    .select({ id: foldersTable.id })
                    .from(foldersTable)
                    .where(eq(foldersTable.project_id, projectId)),
                ),
              ),
            ),
            isNull(chaptersTable.deleted_at),
          ),
        )
        .groupBy(dailyWordCountsTable.date);

      return wordCounts.map((wordCount) => ({
        date: wordCount.date,
        count: wordCount.count,
      }));
    },
  });
};

// Hook to fetch monthly word counts
export const useMonthlyWordCounts = (
  projectId: number,
): UseQueryResult<Array<{ month: string; count: number }>, Error> => {
  return useQuery({
    queryKey: ["monthlyWordCounts", projectId],
    queryFn: async () => {
      const wordCounts = await database
        .select({
          date: dailyWordCountsTable.date,
          count: sum(dailyWordCountsTable.word_count).mapWith(
            (val) => Number(val) || 0,
          ),
        })
        .from(dailyWordCountsTable)
        .innerJoin(
          chaptersTable,
          eq(dailyWordCountsTable.chapter_id, chaptersTable.id),
        )
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            or(
              and(
                eq(chapterParentsTable.parent_type, "project"),
                eq(chapterParentsTable.parent_id, projectId),
              ),
              and(
                eq(chapterParentsTable.parent_type, "folder"),
                inArray(
                  chapterParentsTable.parent_id,
                  database
                    .select({ id: foldersTable.id })
                    .from(foldersTable)
                    .where(eq(foldersTable.project_id, projectId)),
                ),
              ),
            ),
            isNull(chaptersTable.deleted_at),
          ),
        )
        .groupBy(dailyWordCountsTable.date);

      // Group by month and year
      const monthlyCounts = wordCounts.reduce(
        (acc, curr) => {
          const date = new Date(curr.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: date,
              count: 0,
            };
          }
          acc[monthKey].count += Number(curr.count) || 0;
          return acc;
        },
        {} as Record<string, { month: Date; count: number }>,
      );

      return Object.values(monthlyCounts)
        .map(({ month, count }) => ({
          month: month.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          count,
        }))
        .sort(
          (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
        );
    },
  });
};

// Hook to folder count
export const useFolderCount = (
  projectId: number,
): UseQueryResult<{ count: number }, Error> => {
  return useQuery({
    queryKey: ["folderCount", projectId],
    queryFn: async () => {
      const folderCount = await database
        .select({ count: count() })
        .from(foldersTable)
        .where(eq(foldersTable.project_id, projectId));

      return folderCount[0].count;
    },
  });
};

export const useCurrentStreak = (
  projectId: number,
): UseQueryResult<
  { currentStreak: number; lastEditDate: string | null },
  Error
> => {
  return useQuery({
    queryKey: ["currentStreak", projectId],
    queryFn: async () => {
      // Get all daily word counts for the project
      const wordCounts = await database
        .select({
          date: dailyWordCountsTable.date,
          count: sum(dailyWordCountsTable.word_count),
        })
        .from(dailyWordCountsTable)
        .innerJoin(
          chaptersTable,
          eq(dailyWordCountsTable.chapter_id, chaptersTable.id),
        )
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            eq(chapterParentsTable.parent_type, "project"),
            eq(chapterParentsTable.parent_id, projectId),
          ),
        )
        .groupBy(dailyWordCountsTable.date)
        .orderBy(dailyWordCountsTable.date);

      if (wordCounts.length === 0) {
        return { currentStreak: 0, lastEditDate: null };
      }

      // Sort dates in descending order (assuming date is already in ISO format)
      const sortedDates = wordCounts
        .map((wc) => wc.date)
        .sort((a, b) => b.localeCompare(a));

      let currentStreak = 0;
      const lastEditDate = sortedDates[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if the most recent edit was today or yesterday
      const lastEditDateObj = new Date(lastEditDate);
      const daysSinceLastEdit = Math.floor(
        (today.getTime() - lastEditDateObj.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastEdit > 1) {
        return { currentStreak: 0, lastEditDate };
      }

      // Calculate streak
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const currentDate = new Date(sortedDates[i]);
        const nextDate = new Date(sortedDates[i + 1]);

        const daysBetween = Math.floor(
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysBetween === 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Count the last date as well
      currentStreak++;

      return {
        currentStreak,
        lastEditDate,
      };
    },
  });
};

export const useMostProductiveWeekday = (
  projectId: number,
): UseQueryResult<string, Error> => {
  return useQuery({
    queryKey: ["mostProductiveWeekday", projectId],
    queryFn: async () => {
      const wordCounts = await database
        .select({
          weekday: sql<string>`strftime('%w', ${dailyWordCountsTable.date})`,
          count: sum(dailyWordCountsTable.word_count),
        })
        .from(dailyWordCountsTable)
        .innerJoin(
          chaptersTable,
          eq(dailyWordCountsTable.chapter_id, chaptersTable.id),
        )
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            eq(chapterParentsTable.parent_type, "project"),
            eq(chapterParentsTable.parent_id, projectId),
          ),
        )
        .groupBy(sql`strftime('%w', ${dailyWordCountsTable.date})`);

      const weekdayMap: Record<string, string> = {
        "0": "Sunday",
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
      };

      const mostProductiveWeekday = wordCounts.reduce(
        (acc, curr) => {
          const weekday = curr.weekday;
          const count = curr.count;

          if (!acc[weekday]) {
            acc[weekday] = { weekday, count: 0 };
          }

          acc[weekday].count += Number(count) || 0;
          return acc;
        },
        {} as Record<string, { weekday: string; count: number }>,
      );

      const sortedWeekdays = Object.values(mostProductiveWeekday).sort(
        (a, b) => b.count - a.count,
      );

      return weekdayMap[sortedWeekdays[0].weekday];
    },
  });
};
