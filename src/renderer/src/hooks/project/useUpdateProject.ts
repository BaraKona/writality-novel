import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { Project } from '@shared/models';

export const useUpdateProject = (): UseMutationResult<Project, Error, Project, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Project) => window.api.updateProject(project),
    mutationKey: ['updateProject'],
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.setQueryData(['projects', data.id], data);
    },
  });
};
