import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { notesTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

type UpdateNoteChapterParams = {
  noteId: number;
  chapterId: number | null;
};

export const useUpdateNoteChapter = (): UseMutationResult<
  void,
  unknown,
  UpdateNoteChapterParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-note-chapter"],
    mutationFn: async ({ noteId, chapterId }: UpdateNoteChapterParams) => {
      await database
        .update(notesTable)
        .set({ chapter_id: chapterId })
        .where(eq(notesTable.id, noteId))
        .run();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      toast.success("Note chapter updated successfully");
    },
  });
};
