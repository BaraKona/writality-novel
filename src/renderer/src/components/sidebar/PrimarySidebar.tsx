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

import { Sidebar } from '../ui/sidebar'
import { ProjectSwitcher } from '../ProjectSwitcher'
import { NavMain } from '../nav-main'
import { SidebarFiles } from './SidebarFiles'
import { NavUser } from '../nav-user'
import { ProjectImage } from '../ProjectImage'
import { useProject } from '@renderer/hooks/project/useProject'
import { ProjectDirectory } from '@shared/models'
import defaultBannerImage from '@renderer/assets/images/fantasy-endless-hole-landscape.jpg'

export function PrimarySidebar({
  projectDir,
  ...props
}: React.ComponentProps<typeof Sidebar> & { projectDir: ProjectDirectory }) {
  const { data: currentProject } = useProject(projectDir?.currentProjectId)

  const data = {
    // user: {
    //   name: projectDir?.name,
    //   position: 'Writer',
    //   avatar: '/avatars/shadcn.jpg'
    // },
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

  if (!currentProject) {
    return null
  }

  return (
    <aside
      className="relative top-0 left-0 z-10 flex h-full grow flex-col border-r bg-sidebar pt-8"
      {...props}
    >
      <section className="w-full p-2">
        <ProjectImage image={defaultBannerImage} />
        <ProjectSwitcher currentProject={currentProject} />
      </section>
      <section className="flex-grow overflow-y-auto">
        <NavMain items={data.navMain} />
        <SidebarFiles project={currentProject} />
      </section>
      <section className="mt-auto">
        <NavUser
          user={{ name: projectDir?.name, position: 'Writer', avatar: '/avatars/shadcn.jpg' }}
        />
      </section>
    </aside>
  )
}
