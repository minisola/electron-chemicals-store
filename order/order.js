const {
  ipcRenderer
} = require('electron')

const fs = require('fs-extra');
const path = require('path')
const dayjs = require('dayjs')
const {dialog,app} = require('electron').remote;


const {
  loading,
  backup,
  recover
} = require("../utils")

const CustomerInit = require("./page/customer")
const ExpressInit = require("./page/express")
const SupplierInit = require("./page/supplier")

const nedb = require('nedb');

// 实例化连接对象（不带参数默认为内存数据库）

const dbFile = path.join(app.getPath('userData'), '/db/local/order.db')
console.log(dbFile);

fs.ensureFileSync(dbFile)

let db = new nedb({
  filename: dbFile,
  autoload: true
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('start');

  //初始化默认数据
  db.find({
    dataType: 'customer'
  }).sort({
      createTime: -1
  }).exec((err, ret) => {
    if(!err) localStorage.customer = JSON.stringify(ret)
  })
  db.find({
    dataType: 'express'
  }).sort({
      createTime: -1
  }).exec((err, ret) => {
    if(!err) localStorage.express = JSON.stringify(ret)
  })
  db.find({
    dataType: 'supplier'
  }).sort({
      createTime: -1
  }).exec((err, ret) => {
    if(!err) localStorage.supplier = JSON.stringify(ret)
  })

  //初始化订单表
  require("./page/index").init(db)

  //绑定备份按钮
  $("#backupHandle").click(function () {
    backup({dialog,app},err=>{
      layer.closeAll()
      if(err){
        layer.alert(err)
      }else{
        layer.alert("备份成功")
      }
    })
  })
 //绑定恢复按钮
  $("#recoverHandle").click(function () {
    recover(null,{dialog,app},err=>{
      layer.closeAll()
      if(err){
        layer.alert(err)
      }else{
        loading("请稍候..")
        layer.closeAll()
        layer.alert('恢复成功,应用将自动重启以生效',()=>{
          ipcRenderer.send('relaunch')
        })
      }
    })
  })

  //生成自動備份列表
  const backupPath = path.join(app.getPath('userData'), '/db/backup')

  let backupFiles = fs.readdirSync(backupPath).reverse()
  backupFiles = backupFiles.filter(el=>/.+\.db$/.test(el))

  $("#autoBackupTable tbody").html("")
  if (backupFiles && backupFiles.length) {
      let html = ""
      backupFiles.forEach((el, i) => {
          let name =dayjs(Number(el.match(/[0-9]+/g)[0])).format('YYYY-MM-DD HH:mm:ss') 
          html += `<tr>
        <td><b>${name}</b></td>
        <td>
          <button data-index="${i}" data-file="${el}" data-time="${name}" type="button" class="btn btn-sm btn-outline-primary btn-table-inner btn-table-inner-recover">恢复</button>
        </td>
      </tr>`
      })
      $("#autoBackupTable tbody").html(html)
  }

  $(document).on('click','.btn-table-inner-recover',function () {
    const coverFile = $(this).data('file')
    const time = $(this).data('time')
    layer.confirm(`确认要将数据恢复到 ${time} (建议恢复前先手动备份当前数据)`,(index)=>{

      //先自动备份
      require('./autoBackup').checkBackup(app)
      
      //再恢复
      recover([path.join(app.getPath('userData'), '/db/backup/' + coverFile)],{
        app
      },err=>{
        layer.closeAll()
        if(err){
          layer.alert(err)
        }else{
          layer.alert('恢复成功,应用将自动重启以生效',()=>{
            ipcRenderer.send('relaunch')
          })
        }
      })
    })
  })




  //主导航
  $("#topNav a").on('click',function () {
    const index = $(this).index()
    const maintain = $("#maintain");
    const orderContainer = $("#orderContainer");
    $(this).addClass('active').siblings().removeClass('active')
    switch (index) {
      case 0:
          orderContainer.show()
          maintain.hide()
        break;
      case 1:
          orderContainer.hide()
          maintain.show()
        break;
    }

  });


  //侧边导航
  $("#siderNav a").on('click', function () {
    const index = $(this).index()
    const titleBar = $("#tableTitle")
    const tableContainer = $("#tableContainer")
    const backupContainer = $("#backupContainer");
    $(this).addClass('active').siblings().removeClass('active')
    titleBar.find("button").hide()
    backupContainer.hide()
    tableContainer.hide()

    switch (index) {
      case 0:
          backupContainer.show()
        break;
      case 1:
        tableContainer.show()
        CustomerInit(db)
        break;
      case 2:
        tableContainer.show()
        ExpressInit(db)
        break;
      case 3:
        tableContainer.show()
        SupplierInit(db)
        break;
      default:
        break;
    }
  })

})