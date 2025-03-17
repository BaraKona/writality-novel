import { FC } from "react";
import { FileStackIcon, FileText } from "lucide-react";
import { useChapterVersions } from "@renderer/hooks/chapter/version/useChapterVersions";
import { defaultDateTimeFormat } from "@shared/functions";
import { chaptersTable } from "@db/schema";

export const FileVersions: FC<{ file: typeof chaptersTable.$inferSelect }> = ({
  file,
}) => {
  const { data: versions, isLoading } = useChapterVersions(file?.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0.5 px-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex bg-border h-6 rounded-md items-center gap-2 py-1 px-2 text-xs"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-0.5 grow px-2 text-secondary-sidebar-foreground">
      {versions?.length === 0 || !versions ? (
        <div className="w-full flex flex-col gap-0.5 items-center">
          <div className="flex items-center mt-8 gap-2 text-sm">
            <FileStackIcon size={18} />
            No versions yet.
          </div>
          <p className="text-xs mt-2 max-w-[250px] text-center mx-auto">
            Versions are created automatically when you save your file. By
            default, we create a new version every 200 words you add or delete
          </p>
        </div>
      ) : (
        versions.map((version, index) => (
          <div
            key={index}
            className="flex items-center gap-2 py-1 px-2 text-[0.8rem] rounded-md cursor-default hover:bg-hover"
          >
            <div className=" flex gap-1 items-center">
              <FileText size={16} />
              {defaultDateTimeFormat(version.created_at)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
