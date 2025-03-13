import { projectsTable } from "@db/schema";
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Image,
  Globe2Icon,
  SquareUser,
} from "lucide-react";

export const data = (currentProject?: typeof projectsTable) => {
  return {
    openProject: {
      name: currentProject?.name || "Untitled",
    },
    projects: [
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
    ],
    navMain: [
      {
        title: "World",
        url: "/world",
        icon: Globe2Icon,
        // isActive: true,
        items: [
          {
            title: "Map",
            url: "/world/map",
          },
          {
            title: "History",
            url: "/world/history",
          },
          {
            title: "Analytics",
            url: "/world/analytics",
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
  };
};
