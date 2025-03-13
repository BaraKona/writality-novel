import { FC, ReactNode } from "react";
import {
  FileStackIcon,
  LightbulbIcon,
  ListTodoIcon,
  PencilRulerIcon,
} from "lucide-react";
import { FileNotes } from "./sidebar/FileNotes";
import { ChapterSidebarState } from "@renderer/routes/chapters/$chapterId";

type FileSidebarListItemProps = {
  name: string;
  children?: ReactNode;
  active?: boolean;
  setSidebarState: (state) => void;
};

export const FileSidebar: FC<{
  sidebarState: ChapterSidebarState;
  setSidebarState: (state) => void;
}> = ({ sidebarState, setSidebarState }) => {
  return (
    <div className="grow flex flex-col rounded-l-xl border border-secondary-sidebar-border shadow-md pointer-events-auto bg-secondary-sidebar border-r-0">
      <div className="flex w-full gap-4 border-b border-secondary-sidebar-border px-2 py-1 text-xs font-medium">
        <FileSidebarListItem
          name="notes"
          active={sidebarState.category === "notes"}
          setSidebarState={setSidebarState}
        >
          <LightbulbIcon
            size={16}
            strokeWidth={2}
            className="stroke-muted-foreground"
          />
        </FileSidebarListItem>
        <FileSidebarListItem
          name="todo"
          active={sidebarState.category === "todo"}
          setSidebarState={setSidebarState}
        >
          <ListTodoIcon
            size={16}
            strokeWidth={2}
            className="stroke-muted-foreground"
          />
        </FileSidebarListItem>
        <FileSidebarListItem
          name="versions"
          active={sidebarState.category === "versions"}
          setSidebarState={setSidebarState}
        >
          <FileStackIcon
            size={16}
            strokeWidth={2}
            className="stroke-muted-foreground"
          />
        </FileSidebarListItem>
        <FileSidebarListItem
          name="drafts"
          active={sidebarState.category === "drafts"}
          setSidebarState={setSidebarState}
        >
          <PencilRulerIcon
            size={16}
            strokeWidth={2}
            className="stroke-muted-foreground"
          />
        </FileSidebarListItem>
      </div>
      <div className="flex grow flex-col overflow-y-auto pt-2">
        {sidebarState.category === "notes" && <FileNotes />}
      </div>
    </div>
  );
};

function FileSidebarListItem({
  name,
  children,
  active,
  setSidebarState,
}: FileSidebarListItemProps): JSX.Element {
  return (
    <div
      className={`relative flex cursor-default items-center gap-1 py-1`}
      onClick={() =>
        setSidebarState({
          state: "open",
          category: name,
        })
      }
    >
      <span className="shrink-0">{children}</span>
      <span
        className={`capitalize ${active ? "text-secondary-sidebar-primary-foreground" : "text-secondary-sidebar-foreground"}`}
      >
        {name}
      </span>
      {active && (
        <div className="absolute right-0 -bottom-[5px] left-0 mx-auto h-[3px] w-10 rounded rounded-t-full bg-muted-foreground" />
      )}
    </div>
  );
}
