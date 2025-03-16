import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "../ui/breadcrumb";
import { getTimeFromNow } from "@renderer/lib/utils";
import {
  BookOpenTextIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FileTextIcon,
  MenuIcon,
} from "lucide-react";
import { FC } from "react";
import { Separator } from "../ui/separator";
import { Statistic } from "../Statistic";
import { Button } from "../ui/button";
import { ChapterSidebarState } from "@renderer/routes/chapters/$chapterId";
import { Open } from "@renderer/routes/__root";
import { chaptersTable } from "@db/schema";

export const Infobar: FC<{
  chapter: typeof chaptersTable.$inferSelect;
  word: number;
  setSidebarState: (ChapterSidebarState) => void;
  sidebarState: ChapterSidebarState;
}> = ({ chapter, word, setSidebarState, sidebarState }) => {
  console.log();
  return (
    <div className="flex h-[2.25rem] w-full flex-shrink-0 items-center border-b justify-between gap-2 overflow-x-auto px-2">
      <div className="flex items-center gap-0.5">
        <Breadcrumb className="flex w-fit shrink-0 items-center gap-1">
          {/* {chapter.ancestors?.map((ancestor) => (
            <BreadcrumbList
              key={ancestor.id}
              className="shrink-0 text-xs font-medium"
            >
              <Link
                to={`/folders/$folderId`}
                params={{ folderId: ancestor.id.toString() }}
                disabled={ancestor.type === "project"}
                className={`group ${ancestor.type === "project" ? "" : "hover:bg-accent"} shrink-0 rounded-md p-1 px-1.5 text-xs font-medium`}
              >
                <BreadcrumbItem className="flex max-w-48 shrink-0 gap-1">
                  {ancestor.type === "project" ? (
                    <BookTextIcon
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0"
                    />
                  ) : (
                    <FolderOpenIcon
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0"
                    />
                  )}
                  <span className="truncate">{ancestor.name}</span>
                </BreadcrumbItem>
              </Link>

              <BreadcrumbSeparator>
                <ChevronRight
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0"
                />
              </BreadcrumbSeparator>
            </BreadcrumbList>
          ))} */}
          <BreadcrumbList className="shrink-0 text-xs font-medium">
            <BreadcrumbItem className="flex max-w-48 shrink-0 gap-1 pl-1 text-text">
              <FileTextIcon size={16} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{chapter?.name}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-0.5 pr-1">
        <div className="text-secondaryText flex items-center gap-1 text-xs">
          <span className="text-xs font-medium text-text">Words:</span>
          {word}
        </div>
        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        <Statistic
          text="Last edited"
          content={getTimeFromNow(chapter?.updated_at || new Date().getTime())}
          align="right"
          className="text-secondaryText shrink-0"
        />

        <Button
          variant="ghost"
          size="icon"
          className="group ml-1 transition-transform duration-200 ease-in"
        >
          {/* <PencilLineIcon
            size={16}
            strokeWidth={1.5}
            className={`${fileContent?.data.readonly ? 'hidden' : ''}`} */}
          {/* /> */}
          <BookOpenTextIcon size={16} strokeWidth={1.5} className="shrink-0" />
        </Button>
        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />
        <Button
          variant="ghost"
          size="icon"
          className="group hover:bg-background"
          onClick={() => {
            setSidebarState({
              state: sidebarState.state === Open.Open ? Open.Closed : Open.Open,
              category: sidebarState.category || "note",
            });
          }}
        >
          {sidebarState.state === Open.Open ? (
            <>
              <MenuIcon
                size={16}
                strokeWidth={1.5}
                className="block shrink-0 group-hover:hidden"
              />
              <ChevronsRightIcon
                size={16}
                strokeWidth={1.5}
                className="hidden shrink-0 group-hover:block"
              />
            </>
          ) : (
            <>
              <ChevronsLeftIcon
                size={16}
                strokeWidth={1.5}
                className="hidden shrink-0 group-hover:block"
              />
              <MenuIcon
                size={16}
                strokeWidth={1.5}
                className="block shrink-0 group-hover:hidden"
              />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
