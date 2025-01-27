import { useQuery } from "@tanstack/react-query";

export const useAllProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => window.api.getAllProjects(),
  })
}