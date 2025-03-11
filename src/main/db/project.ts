import { projectsTable } from "../../db/schema";
import { eq } from "drizzle-orm/sql";

export const useProject = () => {
  // async function createProject(name?: string): Promise<{ id: number }> {
  //   const result = await database
  //     .insert(projectsTable)
  //     .values({
  //       name: name || "New Project",
  //       description: serialize(""),
  //       emoji: serialize(""),
  //     })
  //     .run();
  //   return { id: result.lastInsertRowid as number };
  // }

  async function getProject(id: number) {
    const project = await database
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, id))
      .get();

    if (!project) {
      return null;
    }

    return {
      ...project,
      description: deserialize(project.description),
      emoji: deserialize(project.emoji),
    };
  }

  // async function updateProject(
  //   project: typeof projectsTable,
  // ): typeof projectsTable {
  //   await database
  //     .update(projectsTable)
  //     .set({
  //       name: project.name,
  //       description: serialize(project.description),
  //       emoji: serialize(project.emoji),
  //     })
  //     .where(eq(projectsTable.id, project.id))
  //     .run();
  //   return project;
  // }

  // function deleteProject(id: number): boolean {
  //   const result = database
  //     .delete(projectsTable)
  //     .where(eq(projectsTable.id, id))
  //     .run();
  //   return result.changes > 0;
  // }

  // function getAllProjects(): Project[] {
  //   const allProjects = database.select().from(projectsTable).all();
  //   return allProjects.map((project) => ({
  //     ...project,
  //     description: deserialize(project.description),
  //     emoji: deserialize(project.emoji),
  //   }));
  // }

  // function getProjectFiles(project_id: number): any {
  //   try {
  //     const stmt = database.prepare(SELECT_PROJECT_FILES);
  //     const stmt2 = database.prepare(SELECT_PROJECT_FOLDERS);
  //     const chapters = stmt.all(project_id);
  //     const folders = stmt2.all(project_id);
  //     return { chapters, folders };
  //   } catch (error) {
  //     console.error("Error fetching project files:", error);
  //     throw error;
  //   }
  // }
  // function getProjectFiles(projectId: number): {
  //   chapters: any[];
  //   folders: any[];
  // } {
  //   try {
  //     // Fetch all chapters linked to the project
  //     const chapters = database
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
  //     };
  //   } catch (error) {
  //     console.error("Error fetching project files:", error);
  //     throw error;
  //   }
  // }
  return {
    // createProject,
    getProject,
    // updateProject,
    // deleteProject,
    // getAllProjects,
    // getProjectFiles,
  };
};
