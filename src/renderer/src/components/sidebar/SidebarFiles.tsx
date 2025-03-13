import {
  FilePlus2,
  FolderPlus,
  Forward,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar";
import { Project } from "@shared/models";
import { useCreateFolder } from "@renderer/hooks/folder/useCreateFolder";
import { useCreateChapter } from "@renderer/hooks/chapter/useCreateChapter";
import { FolderListItem } from "./FolderListItem";
import { useLocalStorage } from "@renderer/hooks/useLocalStorage";
import { useProjectFiles } from "@renderer/hooks/project/useProjectFiles";
import { FileListItem } from "./FileListItem";

export function SidebarFiles({ project }: { project: Project }) {
  const { data: projectFiles } = useProjectFiles(project?.id);
  const { mutate: createProjectFolder } = useCreateFolder(project?.id);
  const { mutate: createChapter } = useCreateChapter(project?.id, "project");

  const [openFolders, setOpenFolders] = useLocalStorage<{
    [key: string]: boolean;
  }>("openFolders", {});

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        Files
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Plus size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 rounded-lg"
            side={"right"}
            align="start"
          >
            <DropdownMenuItem onClick={() => createChapter("project")}>
              <FilePlus2 className="text-muted-foreground" />
              <span>Create file</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createProjectFolder(null)}>
              <FolderPlus className="text-muted-foreground" />
              <span>Create Folder</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Forward className="text-muted-foreground" />
              <span>Share Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 className="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projectFiles?.folders?.map((item) => (
          <FolderListItem
            key={item.id}
            folder={item}
            level={0}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
          />
        ))}
        {projectFiles?.chapters?.map((chapter) => (
          <FileListItem key={chapter.id} chapter={chapter} level={0} />
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
