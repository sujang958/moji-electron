import {
  BrowserWindow,
  Menu,
  Tray,
  app,
  globalShortcut,
  nativeImage,
  screen,
} from "electron"
import { join } from "path"

let tray: Tray | null = null
let mojiWin: BrowserWindow | null = null

const createMojiWindow = async () => {
  if (mojiWin) return mojiWin.focus()

  mojiWin = new BrowserWindow({
    width: 300,
    height: 480,
    frame: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
  })

  mojiWin.setMenu(null)

  mojiWin.loadFile(join(__dirname, "../screens/index.html"))

  globalShortcut.register("Ctrl+Shift+I", () => {
    mojiWin?.webContents.openDevTools()
  })

  globalShortcut.register("Ctrl+R", () => {
    mojiWin?.reload()
  })
}

app.whenReady().then(async () => {
  await createMojiWindow()

  tray = new Tray(
    nativeImage.createFromPath(join(__dirname, "../images/icon.png"))
  )
  tray.setToolTip("Moji")

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
  tray.on("click", () => {
    mojiWin?.show()
  })

  globalShortcut.register("Shift+Capslock", () => {
    mojiWin?.show()
  })

  globalShortcut.register("Escape", () => {
    mojiWin?.hide()
  })
})
