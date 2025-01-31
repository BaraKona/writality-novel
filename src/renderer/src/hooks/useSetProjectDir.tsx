import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useSetProjectDir = () => {
  const queryClient = useQueryClient();
 return useMutation<void, Error, number>({
    mutationFn: (newId: number) => window.api.setCurrentProjectId(newId),
    mutationKey: ['switchProject'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentProjectDir'] })
    }
  })
}

