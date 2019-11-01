const {
  ipcRenderer
} = require('electron')

const dayjs = require('dayjs')

const {
  loading,
  backup,
  recover
} = require("../utils")

const {
  init,
  edit
} = require("./page/index")
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


  const Main = {
    created() {
      this.loadList()
    },
    methods: {
      loadList() {
        db.find({
          dataType: 'order'
        }).sort({
          createTime: -1
        }).exec((err, res) => {
          if (!err) {
            console.log(res);
            let newList = []
            res.forEach(el => {
              // newList.push(el)
              if (el.goods && el.goods.length) {
                el.goods.forEach((goods, i) => {
                  if (i === 0) {
                    goods = Object.assign({}, el, goods)
                    // //如果是第一个商品给予一个P值识别以便于合并单元格
                    // goods.type = 'p'
                  }
                  goods._pid = el._id
                  goods.date = dayjs(el.date).format('YYYY/MM/DD')
                  newList.push(goods)
                })
              }
            })
            this.tableData = newList
          }
        })
      },
      delRowEvent(scope) {
        const {
          row
        } = scope
        layer.confirm("删除此条订单?", () => {
          db.remove({
            _id: row._pid
          }, err => {
            if (err) return layer.msg('err')
            layer.msg("删除成功")
            this.loadList()
          })
        })
      },
      editRowEvent(scope) {
        const {
          row
        } = scope
        edit(db, this, row._pid)
      },
      spanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        const goodsNum = (row.goods && row.goods.length) || 0

        function mergeColumn() {
          if (goodsNum) {
            return [goodsNum, 1]
          } else {
            return [0, 0]
          }
        }

        switch (columnIndex) {
          case 1:
            return mergeColumn()
            break;
          case 9:
            return mergeColumn()
            break;
          case 11:
            return mergeColumn()
            break;

          case 12:
            return mergeColumn()
            break;
          case 15:
            return mergeColumn()
            break;
          case 16:
            return mergeColumn()
            break;
          case 19:
            return mergeColumn()
            break;
          case 17:
            return mergeColumn()
            break;
          case 20:
            return mergeColumn()
            break;
          case 21:
            return mergeColumn()
            break;
          case 22:
            return mergeColumn()
            break;
          case 23:
            return mergeColumn()
            break;
          case 24:
            return mergeColumn()
            break;
            case 25:
                return mergeColumn()
                break;
          default:
            return [1, 1]
            break;
        }
      }
    },
    data() {
      return {
        tableData: []
      }
    }
  }
  const Ctor = Vue.extend(Main)
  const table = new Ctor().$mount('#orderTalbe')

  console.log('start');

  //初始化默认数据
  db.find({
    dataType: 'customer'
  }).sort({
    createTime: -1
  }).exec((err, ret) => {
    if (!err) localStorage.customer = JSON.stringify(ret)
  })
  db.find({
    dataType: 'express'
  }).sort({
    createTime: -1
  }).exec((err, ret) => {
    if (!err) localStorage.express = JSON.stringify(ret)
  })
  db.find({
    dataType: 'supplier'
  }).sort({
    createTime: -1
  }).exec((err, ret) => {
    if (!err) localStorage.supplier = JSON.stringify(ret)
  })

  //初始化订单表
  init(db, table)

  //绑定备份按钮
  $("#backupHandle").click(function () {
    backup(err => {
      layer.closeAll()
      if (err) {
        layer.alert(err)
      } else {
        layer.alert("备份成功")
      }
    })
  })
  //绑定恢复按钮
  $("#recoverHandle").click(function () {
    recover(err => {
      layer.closeAll()
      if (err) {
        layer.alert(err)
      } else {
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
  $("#topNav a").on('click', function () {
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