import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/download.png?asset";
import { appDirectoryName } from "@shared/constants";
import { checkSetup, getCurrentProjectId, setCurrentProjectId } from "./api";
import { execute, runMigrate } from "./db";

let mainWindow: BrowserWindow | null;
let setupWindow: BrowserWindow | null;

function createMainWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 800,
    center: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
    },
    title: appDirectoryName,
    visualEffectState: "active",
    titleBarStyle: "hidden",
    frame: false,
    titleBarOverlay: true,
    trafficLightPosition: { x: 10, y: 10 },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

function createSetupWindow(): void {
  setupWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    maxHeight: 800,
    maxWidth: 1200,
    center: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
    },
    title: "Setup",
    vibrancy: "under-window",
    frame: false,
    visualEffectState: "active",
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    trafficLightPosition: { x: 10, y: 10 },
    icon: join(__dirname, "../../public/writality-icon.ico"),
  });

  setupWindow.on("ready-to-show", () => {
    setupWindow?.show();
  });

  setupWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    setupWindow.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/setup.html`);
  } else {
    setupWindow.loadFile(join(__dirname, "../renderer/setup.html"));
  }
}

// This method chooses the correct window to show based on the setup status
export async function createWindow(): Promise<void> {
  if (checkSetup()) {
    console.info("Setup is complete");
    createMainWindow();
  } else {
    console.info("Setup is not complete");
    createSetupWindow();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Register IPC handlers
  ipcMain.handle("db:execute", execute);
  // root
  ipcMain.handle("getCurrentProjectId", async () => getCurrentProjectId());
  ipcMain.handle("setCurrentProjectId", async (_, id: number) =>
    setCurrentProjectId(id),
  );
  // registerIpcHandlers(ipcMain);

  await runMigrate();
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("setup-complete", () => {
  createMainWindow();
  setupWindow?.close();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
