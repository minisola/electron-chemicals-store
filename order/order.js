const {
  ipcRenderer
} = require('electron')

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
let db = new nedb({
  filename: './db/local/order.db',
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
    backup(err=>{
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
    recover(err=>{
      layer.closeAll()
      if(err){
        layer.alert(err)
      }else{
        loading("请稍候..")
        db = new nedb({
          filename: './db/local/order.db',
          autoload: true
        });
        layer.closeAll()
        layer.alert("恢复成功")
      }
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