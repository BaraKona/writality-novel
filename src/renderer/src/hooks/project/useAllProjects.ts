import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/models";

export const useAllProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => window.api.getAllProjects(),
  })
}