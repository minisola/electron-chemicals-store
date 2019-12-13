const fs = require('fs-extra')
const Client = require('ftp')
const path = require('path')
const Store = require('electron-store');
const store = new Store();
const dayjs = require('dayjs')
const {
  dialog,
  app
} = require('electron').remote;
const {
  ipcRenderer
} = require('electron')

const {
  loading,
  backup,
  recover,
  makTimeStamp
} = require("../utils")



module.exports = {
  init
}

function init(db) {


  // 实例化连接对象（不带参数默认为内存数据库）

  const dbFile = path.join(app.getPath('userData'), '/db/local/order.db')
  console.log(dbFile);

//初始化FTP
  const remoteFtp = new Client();
  remoteFtp.on('ready', function () {
    remoteFtp.list(function (err, list) {
      if (err) {
        layer.msg('远程服务器连接失败')
      }else{
        console.log('ftp连接成功');
        checkDbIsExited(list,remoteFtp,dbFile)
      }
    });
  });
  // connect to localhost:21 as anonymous
  const connectInfo = {
    host: store.get('server'),
    port: "21",
    user: store.get('account'),
    password: store.get('password'),
  }
  remoteFtp.connect(connectInfo);


  //监听事件
  handleEvents(remoteFtp,dbFile)

}

//检查远程是否存在数据
function checkDbIsExited(list,remoteFtp,dbFile) {
  const remoteDbFile =  list.filter(el=>{
    return el.name.indexOf('.db')>-1 ? true :false
  })
  if(!remoteDbFile.length){
    console.log('远程无数据,开始备份');
    uploadFile(remoteFtp,dbFile)
  }else{
    const file = remoteDbFile[0]
    let fileTime = file.name.split('-')[1].split('.db')[0]
    syncFileTime(fileTime)
  }
}

//上传文件
function uploadFile(remoteFtp,dbFile,callback) {
  const timeString = makTimeStamp(true)
    remoteFtp.put(dbFile, 
      `backup-${timeString}.db`
      , function(err) {
        console.log(err);
      if (err) {
        layer.msg('远程服务器数据传输失败...')
      }
      console.log('上传成功');
      callback&&callback()
    });
    syncFileTime(timeString)
}


//同步最新的服务器文件时间

function syncFileTime(timeString){
  const fileTime = dayjs(Number(timeString)).format('YYYY/MM/DD HH:mm:ss')
  $('#serverDbInfo').text('服务器文件时间:' + fileTime)
}


//监听按钮事件
function handleEvents(remoteFtp,dbFile) {

  //点击上传数据库
  $("#uploadDb").click(function () {
    layer.confirm('确认要 上传本地数据到远程服务器并覆盖远程数据 ? ',function(){
      remoteFtp.list('/',(err,list)=>{
        let currentRemoteFile = list.filter(el=>{
          return el.name.indexOf('.db')>-1 ? true :false
        })
        currentRemoteFile = currentRemoteFile[0]
        loading('上传中...')
        uploadFile(remoteFtp,dbFile,function(){
          layer.closeAll()
          layer.alert('数据上传成功')
          remoteFtp.delete(currentRemoteFile.name,function(err){
            console.log(err);
            if(err) layer.alert(err)
          })
        })
    })
  })
  })
  //点击下载数据库
  $("#downloadDb").click(function () {
      layer.confirm('确认要 下载远程数据到本地并覆盖本地数据 ? ',function(){
        loading('下载中...')
        require('./autoBackup').checkBackup(app,()=>{
          download()
        })
        function download() {
            remoteFtp.list('/',(err,list)=>{
              let currentRemoteFile = list.filter(el=>{
                return el.name.indexOf('.db')>-1 ? true :false
              })
              currentRemoteFile = currentRemoteFile[0]
      
              remoteFtp.get(currentRemoteFile.name, function(err, stream) {
                if (err) throw err;
                
                  // stream.once('close', function() { ftp.end(); });
                  const fileHandler = stream.pipe(fs.createWriteStream(dbFile));
                  fileHandler.on('finish',()=>{
                    layer.alert('恢复成功,应用将自动重启以生效',()=>{
                      ipcRenderer.send('relaunch')
                    })
                  })
                });
          })
        }
    })
  })


}






