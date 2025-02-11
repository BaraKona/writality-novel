import fs from 'fs'
import path from 'path'
import { ensureDir, readJson, writeJson } from 'fs-extra'
import { ipcMain } from 'electron'
import { appDirectoryName } from '@shared/constants'
import { homedir } from 'os'
import { useProject } from '../db/project'
import { ProjectDirectory } from '@shared/models'

// get the root directory. This is where the setup.json file will be stored
export const getRootDir: () => string = () => {
  return `${homedir()}/${appDirectoryName}`
}

/**
 * check if the setup file exists, if it doesn't create it and return false
 * if it does, read it and see if the setup is complete, if it is, return true
 * if it isn't, return false
 * */
export function checkSetup(): boolean {
  ensureDir(getRootDir()) // ensure the root directory exists
  const setupPath = path.join(getRootDir(), 'setup.json')
  if (!fs.existsSync(setupPath)) {
    fs.writeFileSync(setupPath, JSON.stringify({ setupComplete: false }))
    return false
  } else {
    const setup = JSON.parse(fs.readFileSync(setupPath).toString())
    return setup.setupComplete
  }
}

/**
 * Complete setup
 * This function is called when the user completes the setup process.
 * It writes to the setup.json file that the setup is complete.
 * And it writes the path and project name in the setup.json file.
 **/
export async function completeSetup(
  projectPath: string,
  name: string,
  username: string
): Promise<void> {
  const setupPath = path.join(getRootDir(), 'setup.json')

  const first_project = useProject().createProject(name) // Get the project ID

  console.log({ first_project })

  writeJson(setupPath, {
    setupComplete: true,
    currentProjectId: first_project.id, // Use the ID here
    projectPath: `${projectPath}/${appDirectoryName}`,
    theme: 'beta-test',
    name: username
  })
    .then(() => {
      ipcMain.emit('setup-complete')
      ensureDir(path.join(projectPath, appDirectoryName, name))
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 * Get the project id from the setup.json file
 * */
export const getCurrentProjectId: () => Promise<ProjectDirectory> = async () => {
  const setupFile = `${getRootDir()}/setup.json`
  if (!fs.existsSync(setupFile)) {
    throw new Error('Setup file does not exist')
  }

  const setup = await readJson(setupFile)

  if (!setup.currentProjectId || !setup.setupComplete) {
    throw new Error('Setup is not complete')
  }

  return setup
}

/**
 * Change the current project id in the setup.json file
 * */
export async function setCurrentProjectId(id: number): Promise<void> {
  const setupFile = `${getRootDir()}/setup.json`
  if (!fs.existsSync(setupFile)) {
    throw new Error('Setup file does not exist')
  }

  const setup = await readJson(setupFile)
  setup.currentProjectId = id

  await writeJson(setupFile, setup)
}
