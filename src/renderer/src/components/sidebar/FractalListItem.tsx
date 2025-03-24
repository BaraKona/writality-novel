import { MoreHorizontal, Trash2, Waypoints } from "lucide-react";
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
import { useDeleteFractal } from "@renderer/hooks/fractal/useDeleteFractal";

export const FractalListItem = ({
  fractal,
  level,
  spacing = 15,
}: {
  fractal: {
    name: string;
    id: number;
  };
  level: number;
  spacing?: number;
}): JSX.Element => {
  const { mutate: deleteFractal } = useDeleteFractal();

  return (
    <SidebarMenuItem
      key={fractal.name}
      className={`relative group/fractal-menu-button ${level > 0 ? "mt-0.5" : ""}`}
    >
      <SidebarMenuButton
        asChild
        className="group-hover/fractal-menu-button:bg-sidebar-accent/10 hover:bg-sidebar-accent/10 active:bg-sidebar-accent/20"
      >
        <Link
          to={`/fractals/$fractalId`}
          params={{ fractalId: `${fractal.id}` }}
          activeProps={{ className: "bg-sidebar-accent/10" }}
          className={`group text-sidebar-foreground ${level === 0 ? "pl-3.5" : ""}`}
        >
          <Waypoints
            className="shrink-0"
            size={16}
            style={{
              marginLeft: `${level * spacing + (level === 0 ? 0 : 7)}px`,
            }}
          />
          <span className="text-sidebar-foreground">{fractal.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="bg-transparent hover:bg-transparent"
        >
          <SidebarMenuAction className="group-hover/fractal-menu-button:visible group-focus-within/fractal-menu-button:visible invisible">
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={"right"}
          align="start"
        >
          <DropdownMenuItem onClick={() => deleteFractal(fractal)}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete Fractal</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
