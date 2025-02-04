'use client'

import * as React from 'react'
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Image,
  Globe2Icon,
  SquareUser
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail
} from '../ui/sidebar'
import { ProjectSwitcher } from '../ProjectSwitcher'
import { NavMain } from '../nav-main'
import { NavFiles } from '../NavFiles'
import { NavUser } from '../nav-user'
import { ProjectImage } from '../ProjectImage'
import { useProject } from '@renderer/hooks/project/useProject'
import { ProjectDirectory } from '@shared/models'

// This is sample data.

export function PrimarySidebar({
  projectDir,
  ...props
}: React.ComponentProps<typeof Sidebar> & { projectDir: ProjectDirectory }) {
  const { data: currentProject } = useProject(projectDir?.currentProjectId)

  const data = {
    user: {
      name: projectDir?.name,
      position: 'Writer',
      avatar: '/avatars/shadcn.jpg'
    },
    openProject: {
      name: currentProject?.name || 'Untitled'
    },
    projects: [
      {
        name: 'All Projects',
        logo: GalleryVerticalEnd,
        url: '/overview'
      },
      {
        name: 'Global Analytics',
        logo: PieChart,
        url: '/analytics'
      }
    ],
    navMain: [
      {
        title: 'World',
        url: '/world',
        icon: Globe2Icon,
        isActive: true,
        items: [
          {
            title: 'Map',
            url: '/world/map'
          },
          {
            title: 'History',
            url: '/world/history'
          },
          {
            title: 'Analytics',
            url: '/world/analytics'
          }
        ]
      },
      {
        title: 'Gallery',
        url: '/gallery',
        icon: Image,
        items: [
          {
            title: 'Inspiration',
            url: '/gallery/inspiration'
          },
          {
            title: 'People',
            url: '/gallery/people'
          },
          {
            title: 'World',
            url: '/gallery/world'
          },
          {
            title: 'Miscellaneous',
            url: '/gallery/miscellaneous'
          }
        ]
      },
      {
        title: 'Characters',
        url: '#',
        icon: SquareUser,
        items: [
          {
            title: 'Introduction',
            url: '#'
          },
          {
            title: 'Get Started',
            url: '#'
          },
          {
            title: 'Tutorials',
            url: '#'
          },
          {
            title: 'Changelog',
            url: '#'
          }
        ]
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
          {
            title: 'User',
            url: '#'
          },
          {
            title: 'Appearance',
            url: '#'
          },
          {
            title: 'Billing',
            url: '#'
          },
          {
            title: 'Limits',
            url: '#'
          }
        ]
      }
    ],
    files: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map
      }
    ]
  }

  return (
    <aside
      className="flex grow flex-col top-0 left-0 z-10 h-full bg-sidebar border-r pt-8"
      {...props}
    >
      <section className="w-full p-2 border-b border-gray-200">
        <ProjectImage />
        <ProjectSwitcher teams={data.projects} openProject={data.openProject} />
      </section>
      <section>
        <NavMain items={data.navMain} />
        <NavFiles projects={data.files} />
      </section>
      <section className="mt-auto">
        <NavUser user={data.user} />
      </section>
    </aside>
  )
}
