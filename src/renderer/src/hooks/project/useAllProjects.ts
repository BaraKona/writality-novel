import { useQuery } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { projectsTable } from "../../../../db/schema";

export const useAllProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => await database.select().from(projectsTable).all(),
  });
};
