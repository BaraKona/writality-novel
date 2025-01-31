import { Button } from '@renderer/components/ui/button'
import image from '../assets/images/campfire.jpeg'
import icon from '../assets/writality-novel.svg'
import { Separator } from '@renderer/components/ui/separator'
import { Input } from '@renderer/components/ui/input'
import { useState } from 'react'
import { appDirectoryName } from '@shared/constants'
import { ArrowRightIcon } from 'lucide-react'

export default function SetupApp(): JSX.Element {
  const [name, setName] = useState<string>('New Project')
  const [username, setUsername] = useState<string>('')
  const [path, setPath] = useState<string>('')
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  function openDialog(): void {
    window.api.openSetupDialog().then((res) => {
      setPath(res.filePaths[0])
    })
  }

  function handleMouseMove(event: React.MouseEvent): void {
    const { clientX, clientY } = event
    setMousePosition({ x: clientX, y: clientY })
  }

  const imageStyle = {
    objectPosition: `${mousePosition.x / 500 + 50}% ${(mousePosition.y / 100) * -1}%`
  }

  async function handleCompleteSetup(): Promise<void> {
    try {
      await window.api.completeSetup(path, name, username)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      className="w-full bg-background lg:grid h-screen lg:grid-cols-2 relative theme-light"
      onMouseMove={handleMouseMove}
    >
      <nav className="absolute h-12 top-0 w-full z-10"></nav>
      <img src={image} alt="setup" className="h-full w-full object-cover" style={imageStyle} />
      <section className="flex grow items-center justify-center py-12 max-w-lg mx-auto px-4">
        <div className="mx-auto grid w-[4 50px] gap-12">
          <div className="grid gap-2 text-center">
            <img
              src={icon}
              alt="setup"
              className="h-20 w-20 object-cover mx-auto"
            />
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-balance">
              Let&apos;s get you setup to start writing.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex gap-8 leading-tight w-full items-center">
              <div className="grow">
                <p className="font-semibold text-sm">Select where you want to store your files</p>
                <p className="text-sm mb-4">
                  We recommend choosing a folder that is synced with a cloud storage service like
                  Dropbox, Google Drive, or iCloud.
                </p>
                <p className="font-semibold text-sm flex gap-2">
                  Path:
                  <span className={`font-normal ${path ? 'text-indigo-700' : 'text-gray-400'}`}>
                    {`${path}/${appDirectoryName}/${name}` || 'No path selected'}
                  </span>
                </p>
                <p className="font-semibold text-sm flex gap-2">
                  Project name:
                  <span className="font-normal text-indigo-700">{name}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="name"
                type="text"
                placeholder="Your project name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                className="px-4"
                disabled={!name || name.length < 1}
                onClick={openDialog}
              >
                Choose Folder
              </Button>
            </div>
            <div className='flex gap-2'>
              <Input
                id="name"
                type="text"
                placeholder="Put your name on it"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Separator />
            <div className="flex gap-8 leading-tight w-full items-center">
              <div className="grow">
                <p className="font-semibold text-sm">Already have an existing project?</p>
                <p className=" text-sm mb-4">
                  Restore your projects from a backup or existing folder.
                </p>
              </div>
              <Button className="px-4" variant="outline">
                Restore
              </Button>
            </div>
          </div>
          <div className="mt-12 flex flex-col">
            <Button
              className="ml-auto flex gap-2 items-center"
              disabled={!path || !name || name.length < 1 || !username || username.length < 1}
              onClick={handleCompleteSetup}
            >
              Complete setup
              <ArrowRightIcon size={16} strokeWidth={1.5} className='stroke-background'/>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
