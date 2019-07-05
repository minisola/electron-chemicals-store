// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog 
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

  //监听搜索(
  ipcMain.on('search', async (e, info) => {
    const goods = await getOne(info).catch(err=>{

      let errString = err.toString()

      if(errString.includes('denied')){
        errString = '数据库密码错误,请重新输入账号和密码'
        e.sender.send('reset')
      }else{
        errString = '数据库连接失败...'
      }
      dialog.showMessageBox({
        error:'error',
        message:errString
      })
    })
    if(!goods) return
    if(!goods.rows.length){
      dialog.showMessageBox({
        error:'info',
        message:'无此产品,请检查关键词重试'
      })
      return
    }
    const resultWindow = new CreateWindow({
      width:'800',
      height:'800',
      parent: mainWindow,
      fileUri: 'result.html'
    })
    resultWindow.webContents.on('did-finish-load', function(){
      this.send('resultInfo', goods);
  });
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

//监听关闭
ipcMain.on('quit',()=>{
  app.quit()
})

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
      icon:'build/icon.png',
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