import {
  FilePlus,
  FolderIcon,
  FolderOpenIcon,
  FolderPlus,
  MoreHorizontal,
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useCreateChapter } from "@renderer/hooks/chapter/useCreateChapter";
import { useCreateFolder } from "@renderer/hooks/folder/useCreateFolder";
import { FileListItem } from "./FileListItem";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useFolderTree } from "@renderer/hooks/folder/useFolderTree";
import { chaptersTable, foldersTable } from "@db/schema";

export const FolderListItem = ({
  folder,
  level,
  openFolders,
  setOpenFolders,
}: {
  folder: typeof foldersTable.$inferSelect;
  level: number;
  openFolders: { [key: string]: boolean };
  setOpenFolders: (value: { [key: string]: boolean }) => void;
}): JSX.Element => {
  const { mutate: createChapter } = useCreateChapter(folder.id, "folder");
  const { mutate: createProjectFolder } = useCreateFolder(folder.project_id);
  const { data: folderFiles } = useFolderTree(folder.id);
  const [animate] = useAutoAnimate();
  const spacing = 15;

  return (
    <div className={`relative ${level > 0 ? "mt-0.5" : ""}`} ref={animate}>
      <div
        className="absolute bottom-0 z-10 bg-foreground/20"
        style={{
          left: `${spacing + level * spacing + 7}px`,
          width: "1px",
          height: "calc(100% - 2.1rem)",
        }}
      ></div>
      <SidebarMenuItem className="group/folder-menu-button ">
        <SidebarMenuButton
          key={folder.name}
          className="peer/folder-menu-button flex w-full relative group-hover/folder-menu-button:bg-sidebar-accent/10 active:bg-sidebar-accent/20 hover:bg-sidebar-accent/10"
          asChild
        >
          <Link
            to={"/folders/$folderId"}
            params={{ folderId: folder.id.toString() }}
            activeProps={{ className: "bg-sidebar-accent/10" }}
            className={`group group/folder relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-sm ring-0 outline-none hover:bg-accent ${level === 0 ? "pl-3.5" : ""}`}
          >
            <div
              className="flex"
              style={{
                paddingLeft: `${level * spacing + (level === 0 ? 0 : 7)}px`,
              }}
            >
              <div
                className="p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenFolders({
                    ...openFolders,
                    [folder.id]: !openFolders[folder.id],
                  });
                }}
              >
                {openFolders[folder.id] ? (
                  <FolderOpenIcon
                    size={18}
                    className="fill-muted-foreground stroke-foreground"
                  />
                ) : (
                  <FolderIcon
                    size={18}
                    className="fill-muted-foreground stroke-foreground"
                  />
                )}
              </div>
            </div>
            <span className="text-sidebar-foreground">{folder.name}</span>
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:bg-transparent">
            <SidebarMenuAction className="group-hover/folder-menu-button:visible invisible group-hover/folder-menu-button:bg-transparent group-focus-within/folder-menu-button:visible">
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 rounded-lg"
            side={"right"}
            align="start"
          >
            <DropdownMenuItem onClick={createChapter}>
              <FilePlus className="text-muted-foreground" />
              <span>New File</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createProjectFolder(folder.id)}>
              <FolderPlus className="text-muted-foreground" />
              <span>New folder</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 className="text-muted-foreground" />
              <span>Delete Folder</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {openFolders[folder.id] && (
        <div className="" ref={animate}>
          {folderFiles?.folders?.map((item) => (
            <FolderListItem
              key={item.id}
              folder={item}
              level={level + 1}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
            />
          ))}
          {folderFiles?.chapters?.map((chapter) => (
            <FileListItem
              key={chapter.id}
              chapter={
                chapter as typeof chaptersTable.$inferSelect & {
                  parent_id: number;
                  parent_type: string;
                }
              }
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
