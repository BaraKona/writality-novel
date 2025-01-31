import { createProject, getProject, getAllProjects, deleteProject, updateProject } from "../db/project";

export const useProject = () => {
  const create = async () => {
    try {
      const allProjects = await getAllProjects();
      const defaultName = `untitled-${allProjects.length + 1}`;

      await createProject(defaultName);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const get = async (id: number) => {
    try {
      return await getProject(id);
    } catch (error) {
      console.error("Error fetching project:", error);
      return error;
    }
  };

  const getAll = async () => {
    try {
      return await getAllProjects();
    } catch (error) {
      console.error("Error fetching all projects:", error);
      return error;
    }
  };

  const singleDelete = async(id: number) => {
    try {
      return await deleteProject(id);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  const update = async (project: any) => {
    try {
      return await updateProject(project);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  return {
    create,
    update,
    get,
    getAll,
    singleDelete
  };
};
