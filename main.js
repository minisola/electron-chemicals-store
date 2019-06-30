// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')
const path = require('path')
const {
  getOne
} = require('./db/mysql/model/goodsModel')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function init() {
  // Create the browser window.
  mainWindow = new CreateWindow({
    fileUri: 'index.html'
  })

  mainWindow.webContents.openDevTools()

  //监听搜索(
  ipcMain.on('search', async (e, info) => {
    const resultWindow = new CreateWindow({
      parent: mainWindow,
      fileUri: 'result.html'
    })
    resultWindow.webContents.openDevTools()

    const goods = await getOne(info)
    resultWindow.webContents.on('did-finish-load', function(){
      this.send('resultInfo', goods);
  });
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) init()
})


/**
 * create a new window
 */
class CreateWindow extends BrowserWindow {
  constructor(params = {}) {
    Menu.setApplicationMenu(null)
    const defaultConfig = {
      width: 600,
      height: 600,
      show:false,
      webPreferences: {
        nodeIntegration: true
      }
    }
    const config = {
      ...defaultConfig,
      ...params
    }
    super(config)
    this.fileUri = config.fileUri
    this.init()
  }
  init() {
    this.loadFile(this.fileUri)
    this.once('ready-to-show',()=>{
      this.show()
    })
  }
}