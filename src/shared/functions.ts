import dayjs from 'dayjs'

// Because of the way routing works and the way we get the files (absolute path),
// we need to filter the path to get the relevant part of the path.
//
// For example, if the path is /Users/username/Projects/Unnamed/World/Untitled,
// we need to filter it to /World/Untitled.
export function getFilteredPath(path: string): string {
  const decodedPath = decodeURIComponent(path)

  // remove extra slashes
  const fixedPath = decodedPath.replace(/\/\//g, '/')

  // Split the decoded path into segments
  const pathSegments = fixedPath.split('/')

  // Find the index of "file" and remove everything before it, including "file"
  const fileIndex = pathSegments.findIndex((segment) => segment === 'file' || segment === 'canvas')
  const relevantSegments = pathSegments.slice(fileIndex + 1)

  return relevantSegments.join('/')
}

export function getFileNameFromPath(path: string): string {
  const decodedPath = decodeURIComponent(path)
  const pathSegments = decodedPath.split('/')
  return pathSegments[pathSegments.length - 1].replace(/\.[^/.]+$/, '')
}

// For example, if the name is "Untitled 1", we need to remove the number and return "Untitled".
export function removeNameNumber(name: string): string {
  if (name.startsWith('untitled')) return 'untitled'

  return name.replace(/\d+/g, '').trim()
}

export function removeExtension(name: string): string {
  return name.replace(/\.[^/.]+$/, '')
}

export function defaultDateTimeFormat(date: string | Date | number): string {
  return dayjs(date).format('dddd MMM D YYYY, h:mm a')
}

export const generateUniqueId: () => number = () => {
  return Math.floor(Math.random() * Date.now())
}
