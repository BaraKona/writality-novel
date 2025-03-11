import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Project } from "@shared/models";
import { database } from "@renderer/db";
import {
  chapterParentsTable,
  chaptersTable,
  projectsTable,
} from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useProjectFiles = (id: number): UseQueryResult<Project, Error> => {
  return useQuery({
    queryKey: ["projects", "files", id],
    queryFn: () =>
      database
        .select()
        .from(chaptersTable)
        .innerJoin(
          chapterParentsTable,
          eq(chapterParentsTable.chapter_id, chaptersTable.id),
        )
        .where(eq(projectsTable.id, id))
        .all(),
    enabled: !!id,
  });
};

// function chaptersAndFolders() {
//   // Fetch all chapters linked to the project
//   const chapters = database
//     .select()
//     .from(chaptersTable)
//     .innerJoin(
//       chapterParentsTable,
//       eq(chapterParentsTable.chapter_id, chaptersTable.id),
//     )
//     .where(eq(chapterParentsTable.parent_type, "project"))
//     .and(eq(chapterParentsTable.parent_id, projectId))
//     .all();
//   return chapters;
// }

//       .select()
//       .from(chaptersTable)
//       .innerJoin(
//         chapterParentsTable,
//         eq(chapterParentsTable.chapter_id, chaptersTable.id),
//       )
//       .where(eq(chapterParentsTable.parent_type, "project"))
//       .and(eq(chapterParentsTable.parent_id, projectId))
//       .all();

//     // Fetch all folders linked to the project
//     const folders = database
//       .select()
//       .from(foldersTable)
//       .where(eq(foldersTable.project_id, projectId))
//       .all();

//     return {
//       chapters: chapters.map((chapter) => ({
//         ...chapter,
//         description: deserialize(chapter.description), // Deserialize JSON fields
//       })),
//       folders: folders.map((folder) => ({
//         ...folder,
//         description: deserialize(folder.description),
//         emoji: deserialize(folder.emoji),
//         // children: getFoldersByParentFolderId(folder.id!), // Recursively fetch nested folders
//         // chapters: useChapter().getChaptersByFolderId(folder.id!), // Fetch chapters in this folder
//       })),
