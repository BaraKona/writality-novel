import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Project } from "@shared/models";

export const useProject = (id: number): UseQueryResult<Project, Error> => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => window.api.getProject(id),
    enabled: !!id,
  });
}