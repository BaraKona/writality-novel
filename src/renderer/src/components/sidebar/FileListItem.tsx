import { FileText, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useDeleteChapter } from "@renderer/hooks/chapter/useDeleteChapter";
import { chaptersTable } from "@db/schema";

export const FileListItem = ({
  chapter,
  level,
  spacing = 15,
}: {
  chapter: {
    name: string;
    id: number;
  };
  level: number;
  spacing?: number;
}): JSX.Element => {
  const { mutate: deleteChapter } = useDeleteChapter();

  return (
    <SidebarMenuItem
      key={chapter.name}
      className={`relative group/file-menu-button ${level > 0 ? "mt-0.5" : ""}`}
    >
      <SidebarMenuButton
        asChild
        className="group-hover/file-menu-button:bg-sidebar-accent/10 hover:bg-sidebar-accent/10 active:bg-sidebar-accent/20"
      >
        <Link
          to={`/chapters/$chapterId`}
          params={{ chapterId: `${chapter.id}` }}
          activeProps={{ className: "bg-sidebar-accent/10" }}
          className={`group text-sidebar-foreground ${level === 0 ? "pl-3.5" : ""}`}
        >
          <FileText
            className="shrink-0"
            size={16}
            style={{
              marginLeft: `${level * spacing + (level === 0 ? 0 : 7)}px`,
            }}
          />
          <span className="text-sidebar-foreground">{chapter.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="bg-transparent hover:bg-transparent"
        >
          <SidebarMenuAction className="group-hover/file-menu-button:visible group-focus-within/file-menu-button:visible invisible">
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={"right"}
          align="start"
        >
          <DropdownMenuItem
            onClick={() =>
              deleteChapter(chapter as typeof chaptersTable.$inferSelect)
            }
          >
            <Trash2 className="text-muted-foreground" />
            <span>Delete Chapter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
