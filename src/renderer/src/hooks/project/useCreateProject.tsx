import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createProject'],
    mutationFn: () => window.api.createProject(),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['projects']
    })
  })
}