"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Image,
  Globe2Icon,
  SquareUser,
  LucideIcon
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"
import { ProjectSwitcher } from "./ProjectSwitcher"
import { NavMain } from "./nav-main"
import { NavFiles } from "./NavFiles"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "All Projects",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "World",
      url: "/world",
      icon: <Globe2Icon className="text-red-900"/>,
      isActive: true,
      items: [
        {
          title: "Details",
          url: "/world/details",
        },
        {
          title: "Map",
          url: "/world/map",
        },
        {
          title: "History",
          url: "/world/history",
        },
      ],
    },
    {
      title: "Gallery",
      url: "/gallery",
      icon: Image,
      items: [
        {
          title: "Inspiration",
          url: "/gallery/inspiration",
        },
        {
          title: "People",
          url: "/gallery/people",
        },
        {
          title: "World",
          url: "/gallery/world",
        },
        {
          title: "Miscellaneous",
          url: "/gallery/miscellaneous",
        },
      ],
    },
    {
      title: "Characters",
      url: "#",
      icon: SquareUser,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "User",
          url: "#",
        },
        {
          title: "Appearance",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  files: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher teams={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavFiles projects={data.files} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
