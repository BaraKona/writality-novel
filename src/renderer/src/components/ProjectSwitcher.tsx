import { GalleryVerticalEnd, PieChart, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar";
import { useCreateProject } from "@renderer/hooks/project/useCreateProject";
import { useNavigate } from "@tanstack/react-router";
import { EmojiDisplay } from "./EmojiDisplay";
import { projectsTable } from "@db/schema";
import { Value } from "@udecode/plate";

const teams = [
  {
    name: "All Projects",
    logo: GalleryVerticalEnd,
    url: "/overview",
  },
  {
    name: "Global Analytics",
    logo: PieChart,
    url: "/analytics",
  },
];

export function ProjectSwitcher({
  currentProject,
}: {
  currentProject?:
    | (typeof projectsTable.$inferSelect & { description: Value })
    | undefined;
}): JSX.Element {
  const { mutate: createProject } = useCreateProject();
  const navigate = useNavigate();

  if (!currentProject) {
    return <></>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="border bg-primary-foreground text-sidebar-accent-foreground border hover:border-foreground/20 hover:bg-primary-background">
              <div className="rounded bg-background/20 backdrop-blur-sm">
                <EmojiDisplay emoji={currentProject.emoji} type="project" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-serif-thick text-base text-sidebar-foreground">
                  {currentProject.name}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() =>
                  navigate({
                    to: team.url,
                  })
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={createProject}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                New project
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
