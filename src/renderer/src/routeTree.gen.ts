/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const OverviewLazyImport = createFileRoute('/overview')()
const NewPageLazyImport = createFileRoute('/new-page')()
const IndexLazyImport = createFileRoute('/')()
const WorldIndexLazyImport = createFileRoute('/world/')()
const GalleryIndexLazyImport = createFileRoute('/gallery/')()
const CharactersIndexLazyImport = createFileRoute('/characters/')()
const WorldMapLazyImport = createFileRoute('/world/map')()
const WorldHistoryLazyImport = createFileRoute('/world/history')()
const WorldAnalyticsLazyImport = createFileRoute('/world/analytics')()
const GalleryWorldLazyImport = createFileRoute('/gallery/world')()
const GalleryPeopleLazyImport = createFileRoute('/gallery/people')()
const GalleryMiscellaneousLazyImport = createFileRoute(
  '/gallery/miscellaneous',
)()
const GalleryInspirationLazyImport = createFileRoute('/gallery/inspiration')()

// Create/Update Routes

const OverviewLazyRoute = OverviewLazyImport.update({
  id: '/overview',
  path: '/overview',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/overview.lazy').then((d) => d.Route))

const NewPageLazyRoute = NewPageLazyImport.update({
  id: '/new-page',
  path: '/new-page',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/new-page.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const WorldIndexLazyRoute = WorldIndexLazyImport.update({
  id: '/world/',
  path: '/world/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/world/index.lazy').then((d) => d.Route))

const GalleryIndexLazyRoute = GalleryIndexLazyImport.update({
  id: '/gallery/',
  path: '/gallery/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/gallery/index.lazy').then((d) => d.Route))

const CharactersIndexLazyRoute = CharactersIndexLazyImport.update({
  id: '/characters/',
  path: '/characters/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/characters/index.lazy').then((d) => d.Route),
)

const WorldMapLazyRoute = WorldMapLazyImport.update({
  id: '/world/map',
  path: '/world/map',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/world/map.lazy').then((d) => d.Route))

const WorldHistoryLazyRoute = WorldHistoryLazyImport.update({
  id: '/world/history',
  path: '/world/history',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/world/history.lazy').then((d) => d.Route))

const WorldAnalyticsLazyRoute = WorldAnalyticsLazyImport.update({
  id: '/world/analytics',
  path: '/world/analytics',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/world/analytics.lazy').then((d) => d.Route),
)

const GalleryWorldLazyRoute = GalleryWorldLazyImport.update({
  id: '/gallery/world',
  path: '/gallery/world',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/gallery/world.lazy').then((d) => d.Route))

const GalleryPeopleLazyRoute = GalleryPeopleLazyImport.update({
  id: '/gallery/people',
  path: '/gallery/people',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/gallery/people.lazy').then((d) => d.Route),
)

const GalleryMiscellaneousLazyRoute = GalleryMiscellaneousLazyImport.update({
  id: '/gallery/miscellaneous',
  path: '/gallery/miscellaneous',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/gallery/miscellaneous.lazy').then((d) => d.Route),
)

const GalleryInspirationLazyRoute = GalleryInspirationLazyImport.update({
  id: '/gallery/inspiration',
  path: '/gallery/inspiration',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/gallery/inspiration.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/new-page': {
      id: '/new-page'
      path: '/new-page'
      fullPath: '/new-page'
      preLoaderRoute: typeof NewPageLazyImport
      parentRoute: typeof rootRoute
    }
    '/overview': {
      id: '/overview'
      path: '/overview'
      fullPath: '/overview'
      preLoaderRoute: typeof OverviewLazyImport
      parentRoute: typeof rootRoute
    }
    '/gallery/inspiration': {
      id: '/gallery/inspiration'
      path: '/gallery/inspiration'
      fullPath: '/gallery/inspiration'
      preLoaderRoute: typeof GalleryInspirationLazyImport
      parentRoute: typeof rootRoute
    }
    '/gallery/miscellaneous': {
      id: '/gallery/miscellaneous'
      path: '/gallery/miscellaneous'
      fullPath: '/gallery/miscellaneous'
      preLoaderRoute: typeof GalleryMiscellaneousLazyImport
      parentRoute: typeof rootRoute
    }
    '/gallery/people': {
      id: '/gallery/people'
      path: '/gallery/people'
      fullPath: '/gallery/people'
      preLoaderRoute: typeof GalleryPeopleLazyImport
      parentRoute: typeof rootRoute
    }
    '/gallery/world': {
      id: '/gallery/world'
      path: '/gallery/world'
      fullPath: '/gallery/world'
      preLoaderRoute: typeof GalleryWorldLazyImport
      parentRoute: typeof rootRoute
    }
    '/world/analytics': {
      id: '/world/analytics'
      path: '/world/analytics'
      fullPath: '/world/analytics'
      preLoaderRoute: typeof WorldAnalyticsLazyImport
      parentRoute: typeof rootRoute
    }
    '/world/history': {
      id: '/world/history'
      path: '/world/history'
      fullPath: '/world/history'
      preLoaderRoute: typeof WorldHistoryLazyImport
      parentRoute: typeof rootRoute
    }
    '/world/map': {
      id: '/world/map'
      path: '/world/map'
      fullPath: '/world/map'
      preLoaderRoute: typeof WorldMapLazyImport
      parentRoute: typeof rootRoute
    }
    '/characters/': {
      id: '/characters/'
      path: '/characters'
      fullPath: '/characters'
      preLoaderRoute: typeof CharactersIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/gallery/': {
      id: '/gallery/'
      path: '/gallery'
      fullPath: '/gallery'
      preLoaderRoute: typeof GalleryIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/world/': {
      id: '/world/'
      path: '/world'
      fullPath: '/world'
      preLoaderRoute: typeof WorldIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/new-page': typeof NewPageLazyRoute
  '/overview': typeof OverviewLazyRoute
  '/gallery/inspiration': typeof GalleryInspirationLazyRoute
  '/gallery/miscellaneous': typeof GalleryMiscellaneousLazyRoute
  '/gallery/people': typeof GalleryPeopleLazyRoute
  '/gallery/world': typeof GalleryWorldLazyRoute
  '/world/analytics': typeof WorldAnalyticsLazyRoute
  '/world/history': typeof WorldHistoryLazyRoute
  '/world/map': typeof WorldMapLazyRoute
  '/characters': typeof CharactersIndexLazyRoute
  '/gallery': typeof GalleryIndexLazyRoute
  '/world': typeof WorldIndexLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/new-page': typeof NewPageLazyRoute
  '/overview': typeof OverviewLazyRoute
  '/gallery/inspiration': typeof GalleryInspirationLazyRoute
  '/gallery/miscellaneous': typeof GalleryMiscellaneousLazyRoute
  '/gallery/people': typeof GalleryPeopleLazyRoute
  '/gallery/world': typeof GalleryWorldLazyRoute
  '/world/analytics': typeof WorldAnalyticsLazyRoute
  '/world/history': typeof WorldHistoryLazyRoute
  '/world/map': typeof WorldMapLazyRoute
  '/characters': typeof CharactersIndexLazyRoute
  '/gallery': typeof GalleryIndexLazyRoute
  '/world': typeof WorldIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/new-page': typeof NewPageLazyRoute
  '/overview': typeof OverviewLazyRoute
  '/gallery/inspiration': typeof GalleryInspirationLazyRoute
  '/gallery/miscellaneous': typeof GalleryMiscellaneousLazyRoute
  '/gallery/people': typeof GalleryPeopleLazyRoute
  '/gallery/world': typeof GalleryWorldLazyRoute
  '/world/analytics': typeof WorldAnalyticsLazyRoute
  '/world/history': typeof WorldHistoryLazyRoute
  '/world/map': typeof WorldMapLazyRoute
  '/characters/': typeof CharactersIndexLazyRoute
  '/gallery/': typeof GalleryIndexLazyRoute
  '/world/': typeof WorldIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/new-page'
    | '/overview'
    | '/gallery/inspiration'
    | '/gallery/miscellaneous'
    | '/gallery/people'
    | '/gallery/world'
    | '/world/analytics'
    | '/world/history'
    | '/world/map'
    | '/characters'
    | '/gallery'
    | '/world'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/new-page'
    | '/overview'
    | '/gallery/inspiration'
    | '/gallery/miscellaneous'
    | '/gallery/people'
    | '/gallery/world'
    | '/world/analytics'
    | '/world/history'
    | '/world/map'
    | '/characters'
    | '/gallery'
    | '/world'
  id:
    | '__root__'
    | '/'
    | '/new-page'
    | '/overview'
    | '/gallery/inspiration'
    | '/gallery/miscellaneous'
    | '/gallery/people'
    | '/gallery/world'
    | '/world/analytics'
    | '/world/history'
    | '/world/map'
    | '/characters/'
    | '/gallery/'
    | '/world/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  NewPageLazyRoute: typeof NewPageLazyRoute
  OverviewLazyRoute: typeof OverviewLazyRoute
  GalleryInspirationLazyRoute: typeof GalleryInspirationLazyRoute
  GalleryMiscellaneousLazyRoute: typeof GalleryMiscellaneousLazyRoute
  GalleryPeopleLazyRoute: typeof GalleryPeopleLazyRoute
  GalleryWorldLazyRoute: typeof GalleryWorldLazyRoute
  WorldAnalyticsLazyRoute: typeof WorldAnalyticsLazyRoute
  WorldHistoryLazyRoute: typeof WorldHistoryLazyRoute
  WorldMapLazyRoute: typeof WorldMapLazyRoute
  CharactersIndexLazyRoute: typeof CharactersIndexLazyRoute
  GalleryIndexLazyRoute: typeof GalleryIndexLazyRoute
  WorldIndexLazyRoute: typeof WorldIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  NewPageLazyRoute: NewPageLazyRoute,
  OverviewLazyRoute: OverviewLazyRoute,
  GalleryInspirationLazyRoute: GalleryInspirationLazyRoute,
  GalleryMiscellaneousLazyRoute: GalleryMiscellaneousLazyRoute,
  GalleryPeopleLazyRoute: GalleryPeopleLazyRoute,
  GalleryWorldLazyRoute: GalleryWorldLazyRoute,
  WorldAnalyticsLazyRoute: WorldAnalyticsLazyRoute,
  WorldHistoryLazyRoute: WorldHistoryLazyRoute,
  WorldMapLazyRoute: WorldMapLazyRoute,
  CharactersIndexLazyRoute: CharactersIndexLazyRoute,
  GalleryIndexLazyRoute: GalleryIndexLazyRoute,
  WorldIndexLazyRoute: WorldIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/new-page",
        "/overview",
        "/gallery/inspiration",
        "/gallery/miscellaneous",
        "/gallery/people",
        "/gallery/world",
        "/world/analytics",
        "/world/history",
        "/world/map",
        "/characters/",
        "/gallery/",
        "/world/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/new-page": {
      "filePath": "new-page.lazy.tsx"
    },
    "/overview": {
      "filePath": "overview.lazy.tsx"
    },
    "/gallery/inspiration": {
      "filePath": "gallery/inspiration.lazy.tsx"
    },
    "/gallery/miscellaneous": {
      "filePath": "gallery/miscellaneous.lazy.tsx"
    },
    "/gallery/people": {
      "filePath": "gallery/people.lazy.tsx"
    },
    "/gallery/world": {
      "filePath": "gallery/world.lazy.tsx"
    },
    "/world/analytics": {
      "filePath": "world/analytics.lazy.tsx"
    },
    "/world/history": {
      "filePath": "world/history.lazy.tsx"
    },
    "/world/map": {
      "filePath": "world/map.lazy.tsx"
    },
    "/characters/": {
      "filePath": "characters/index.lazy.tsx"
    },
    "/gallery/": {
      "filePath": "gallery/index.lazy.tsx"
    },
    "/world/": {
      "filePath": "world/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
