import { FC } from "react";
import { FileStackIcon, FileText } from "lucide-react";
import { useChapterVersions } from "@renderer/hooks/chapter/version/useChapterVersions";
import { defaultDateTimeFormat } from "@shared/functions";
import { chaptersTable } from "@db/schema";
import { Dialogue } from "@renderer/components/Dialogue";
import { VersionHistory } from "@renderer/components/plate-ui/plate-components/history";
import { deserialize } from "@renderer/db";

export const FileVersions: FC<{
  file: typeof chaptersTable.$inferSelect;
  content: string;
}> = ({ file, content }) => {
  const { data: versions, isLoading } = useChapterVersions(file?.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0.5 px-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex bg-secondary-sidebar-primary h-12 rounded-md items-center gap-2 py-1 px-2 text-xs"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex py-2 flex-col gap-1 grow px-2 text-secondary-sidebar-foreground">
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
          <Dialogue
            key={index}
            title="Compare versions"
            className="w-full max-w-screen-xl min-h-96 max-h-[800px]"
            description="Compare the content of this version with the previous version."
            trigger={
              <div className="p-4 rounded-md cursor-default relative shadow border bg-secondary-sidebar-primary border-secondary-sidebar-border text-sm hover:border-secondary-sidebar-foreground/20 ">
                <div className="flex gap-1 items-center">
                  <FileText size={16} />
                  {defaultDateTimeFormat(version.created_at)}
                </div>
              </div>
            }
          >
            <VersionHistory
              version={deserialize(version.description)}
              chapterVersion={content}
            />
          </Dialogue>
        ))
      )}
    </div>
  );
};
