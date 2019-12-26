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

require('./order/autoBackup').checkBackup(app)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let orderWindow

function init() {
  // Create the browser window.
  mainWindow = new CreateWindow({
    fileUri: 'index.html',
    menus: [{
      label: '设置',
      submenu: [{
        label: '远程服务器设置',
        click: function (event, focusedWindow, focusedWebContents) {
          //设置远程服务器账号密码
          focusedWindow.send('reset')
        }
      }]
    }, {
      label: "信息管理",
      submenu: [{
        label: '登录后台',
        click: function () {
          const remoteWindow = new CreateWindow({
            title: "合晶化工",
            remoteURL: 'http://hopschem.com:8001',
            autoHideMenuBar: true
          })
        }
      }]
    }, {
      label: "订单管理",
      submenu: [{
        label: '订单管理',
        click: function () {
          if (orderWindow) return
          orderWindow = new CreateWindow({
            fileUri: './order/order.html',
            autoHideMenuBar: true
          })
          orderWindow.on('close', () => {
            orderWindow = false
          })
          if (process.env.NODE_ENV === 'dev') orderWindow.openDevTools()

        }
      }]
    }]
  })


  if (process.env.NODE_ENV === 'dev') {
    orderWindow = new CreateWindow({
      fileUri: './order/order.html',
      autoHideMenuBar: true
    })
    orderWindow.openDevTools()

  }

  //监听搜索(
  ipcMain.on('search', async (e, info) => {
    const goods = await getOne(info).catch(err => {

      let errString = err.toString()
      console.log(errString);

      if (errString.includes('denied')) {
        errString = '数据库密码错误,请重新输入账号和密码'
        e.sender.send('reset')
      } else {
        errString = '数据库连接失败...'
      }
      dialog.showMessageBox({
        error: 'error',
        message: errString
      })
    })
    console.log(goods);

    if (!goods) return
    if (!goods.rows.length) {
      dialog.showMessageBox({
        error: 'info',
        message: '无此产品,请检查关键词重试'
      })
      return
    }
    const resultWindow = new CreateWindow({
      parent: mainWindow,
      fileUri: 'result.html',
      autoHideMenuBar: true
    })

    // 2-methyl-7-oxo-4H,7H-[1,2,4]triazolo[1,5-a]pyrimidine-6-carboxylic acid
    resultWindow.webContents.on('did-finish-load', function () {
      this.send('resultInfo', goods);
    });

    if (process.env.NODE_ENV === 'dev') resultWindow.openDevTools()

  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('relaunch', () => {
  app.relaunch()
  app.exit(0)
})

//监听关闭
ipcMain.on('quit', () => {
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
    let size = require('electron').screen.getPrimaryDisplay().workAreaSize
    let template = []
    if (process.platform === 'darwin') {
      template = [{
        label: "Edit",
        submenu: [{
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
          },
          {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
          },
        ]
      }];
    }

    if (params.menus) {
      const menusTemplate = template.concat(template, params.menus)
      const menu = Menu.buildFromTemplate(menusTemplate)
      Menu.setApplicationMenu(menu)
    }
    const defaultConfig = {
      width: parseInt(size.width * 0.8),
      height: parseInt(size.height * 0.8),
      show: false,
      icon: path.join(__dirname,'build/icon.ico'),
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
    this.remoteURL = config.remoteURL
    this.init()
  }
  init() {
    if (this.fileUri) this.loadFile(this.fileUri)
    if (this.remoteURL) this.loadURL(this.remoteURL)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}