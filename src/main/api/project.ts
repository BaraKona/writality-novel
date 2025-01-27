import { createProject, getProject, getAllProjects } from "../db/project";

export const useProject = () => {
  const create = async () => {
    try {
      const allProjects = await getAllProjects();
      const defaultName = `untitled-${allProjects.length + 1}`;
      const defaultDescription = "New beginnings...";

      await createProject(defaultName, defaultDescription);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const get = async (id: number) => {
    try {
      const project = await getProject(id);
      console.log({ project });
      return project;
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const getAll = async () => {
    try {
      const projects = await getAllProjects();
      console.log({ projects });
      return projects;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      return error;
    }
  };

  return {
    create,
    get,
    getAll,
  };
};
