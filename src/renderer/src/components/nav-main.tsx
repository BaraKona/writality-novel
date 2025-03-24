import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@renderer/components/ui/sidebar";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAtom } from "jotai";
import { menuItemStatesAtom } from "@renderer/routes/__root";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode | LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItemStates, setMenuItemStates] = useAtom(menuItemStatesAtom);
  const [animate] = useAutoAnimate();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={menuItemStates[item.title] ?? item.isActive}
            className="group/collapsible"
            ref={(el) => {
              if (el) {
                animate;
              }
            }}
            onOpenChange={(open) => {
              setMenuItemStates((prev) => ({
                ...prev,
                [item.title]: open,
              }));
            }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                className={`hover:bg-sidebar-accent/10 active:bg-sidebar-accent/20 ${location.pathname === item.url ? "bg-sidebar-accent/10" : ""}`}
                onClick={() => {
                  navigate({
                    to: item.url,
                  });
                }}
              >
                {item.icon && React.isValidElement(item.icon)
                  ? item.icon
                  : item.icon
                    ? React.createElement(item.icon as React.ElementType)
                    : null}
                <span
                  className={`font-medium ${location.pathname === item.url ? "text-accent-foreground" : "text-sidebar-foreground"}`}
                >
                  {item.title}
                </span>
                <CollapsibleTrigger
                  asChild
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent ref={animate}>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="hover:bg-sidebar-accent/10"
                      >
                        <Link
                          to={subItem.url}
                          className="hover:bg-sidebar-accent/10"
                          activeProps={{
                            className:
                              "bg-sidebar-accent/10 !text-accent-foreground",
                          }}
                        >
                          {subItem.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
