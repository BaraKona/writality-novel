import { useQuery } from "@tanstack/react-query";

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => window.api.getProject(id),
    enabled: !!id,
  });
}