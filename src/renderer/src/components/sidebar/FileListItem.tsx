import { FileText, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { chaptersTable } from "@db/schema";

export const FileListItem = ({
  chapter,
  level,
  spacing = 15,
}: {
  chapter: typeof chaptersTable;
  level: number;
  spacing?: number;
}): JSX.Element => {
  return (
    <SidebarMenuItem
      key={chapter.name}
      className={`relative ${level > 0 ? "mt-0.5" : ""}`}
    >
      <SidebarMenuButton
        asChild
        className="hover:bg-sidebar-accent/10 active:bg-sidebar-accent/20"
      >
        <Link
          to={`/chapters/$chapterId`}
          params={{ chapterId: chapter.id?.toString() }}
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
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={"right"}
          align="start"
        >
          <DropdownMenuItem>
            <Forward className="text-muted-foreground" />
            <span>Share Project</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete Chapter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
