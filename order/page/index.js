const flatpickr = require("flatpickr");
const {
  makSelect,
  loading
} = require('../../utils')
const dayjs = require('dayjs')


const Vue = require('vue/dist/vue')
require('xe-utils')
const VXETable = require('vxe-table/lib/index')
Vue.use(VXETable)

let app = null

function init(db) {
  const colorMap = {
    red: '#fff1f0',
    blue: '#e6f7ff',
    yellow: '#feffe6',
    green: '#f6ffed',
    gray: '#fafafa'
  }

  app = new Vue({
    data: {
      originData: [],
      filterName: "",
      bodyMenus: [
        [{
          code: 'mark',
          name: '标记',
          children: [{
              code: 'markClear',
              name: '清除标记'
            },
            {
              code: 'red',
              name: '红色'
            },
            {
              code: 'blue',
              name: '蓝色'
            },
            {
              code: 'yellow',
              name: '黄色'
            },
            {
              code: 'green',
              name: '绿色'
            },
            {
              code: 'gray',
              name: '灰色'
            }
          ]
        }]
      ]
    },
    created() {
      $(".order-table-container").height($('body').height() - 150)
      window.onresize = function () {
        $(".order-table-container").height($('body').height() - 150)
      }
      this.loadList()
      //设置高度
    },
    computed: {
      tableData() {
        const res = this.originData
        let newList = []
        res.forEach(el => {
          // newList.push(el)
          if (el.goods && el.goods.length) {
            el.goods.forEach((goods, i) => {
              if (i === 0) {
                goods = Object.assign({}, el, goods)
              }
              goods._pid = el._id
              goods.bgColor = el.bgColor || ''
              goods.active = el.active
              newList.push(goods)
            })
          }
        })
        return newList
      },
      list() {
        let filterName = this.filterName.toString().trim().toLowerCase()
        if (filterName) {
          let searchProps = ['cas', 'date', 'name', 'customer', 'supplier', 'remark']
          let rest = this.originData.filter(order => {
            if (searchProps.some(key => (order[key] || "").toString().toLowerCase().indexOf(filterName) > -1)) {
              return true
            } else {
              const goods = order.goods || []
              let filterGoods = goods.filter(g => {
                if (searchProps.some(key => (g[key] || "").toString().toLowerCase().indexOf(filterName) > -1)) {
                  return true
                } else {
                  return false
                }
              })
              if (filterGoods.length) return true
              else return false
            }
          })
          let newList = []
          rest.forEach(el => {
            if (el.goods && el.goods.length) {
              el.goods.forEach((goods, i) => {
                if (i === 0) {
                  goods = Object.assign({}, el, goods)
                }
                goods._pid = el._id
                goods.bgColor = el.bgColor || ''
                goods.active = el.active
                newList.push(goods)
              })
            }
          })
          return newList
        }
        return this.tableData
      }
    },
    methods: {
      //行选中事件
      currentChangeEvent({
        row
      }) {
        this.originData = this.originData.map(el => {
          if (row.active == true) {
            return {
              ...el,
              active: false
            }
          } else if (row._pid == el._id) {
            return {
              ...el,
              active: true
            }
          } else {
            return {
              ...el,
              active: false
            }
          }
        })
      },
      //行变色
      rowStyle({
        row
      }) {
        if (row.active) {
          return {
            backgroundColor: '#91d5ff',
          }
        } else if (row.bgColor) {
          return {
            backgroundColor: row.bgColor,
          }
        }
      },
      //上下文菜单事件
      contextMenuClickEvent({
        menu,
        row,
        column
      }) {
        if (menu.code != 'mark' && row && column) {
          const {
            _pid
          } = row
          this.originData = this.originData.map(el => {
            if (el._id === _pid) {
              el.bgColor = colorMap[menu.code] || ''
              //保存标记数据
              db.update({
                _id: el._id
              }, {
                $set: {
                  bgColor: el.bgColor
                }
              })
            }
            return el
          })
        }
      },
      loadList() {
        db.find({
          dataType: 'order'
        }).sort({
          date: 1
        }).exec((err, res) => {
          if (!err) {
            res.forEach(el => {
              // newList.push(el)
              if (el.goods && el.goods.length) {
                el.goods.forEach((goods, i) => {
                  goods.date = dayjs(el.date).format('YYYY/MM/DD')
                })
              }
            })
            this.originData = res
          }
        })
      },
      exportDataEvent() {
        this.$refs.order.exportData()
      },
      delRowEvent(row) {
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
      editRowEvent(row) {
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
            return {
              rowspan: goodsNum,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }

        switch (columnIndex) {
          case 1:
            return mergeColumn()
            break;
          case 6:
            return mergeColumn()
            break;
          case 7:
            return mergeColumn()
            break;
          case 9:
            return mergeColumn()
            break;
          case 10:
            return mergeColumn()
            break;
          case 13:
            return mergeColumn()
            break;
          case 14:
            return mergeColumn()
            break;
          case 15:
            return mergeColumn()
            break;
          case 17:
            return mergeColumn()
            break;
          case 18:
            return mergeColumn()
            break;
          case 19:
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
          default:
            return {
              rowspan: 1, colspan: 1
            }
            break;
        }
      }
    }


  }).$mount("#orderTable")






  $("#orderAdd").on('click', function () {
    layer.open({
      type: 1,
      content: require('../orderForm.js'),
      area: ['95%', '95%'],
      btnAlign: "c",
      btn: ["保存", "取消"],
      success() {

        initForm()

      },
      yes() {
        const order = exportData()

        loading("保存中..")

        order.dataType = 'order'
        console.log(order);


        try {
          db.insert(order, (err, res) => {

            layer.closeAll()

            if (!err) {
              layer.msg("保存成功")
              app.loadList()
            } else {
              layer.msg(err)
            }

          })
        } catch (error) {
          console.log(error);

        }

      }
    })
  })
}

//绑定删除按钮事件
function bindDelBtn() {
  $('.del-hook').off('click').on('click', function () {
    const $this = $(this)
    layer.confirm('确认删除此项?', function (index) {
      $this.parents('.card').remove()
      layer.close(index)
    })
  })
}

//初始化表单

function initForm() {
  const customer = JSON.parse(localStorage.customer || "[]")
  const supplier = JSON.parse(localStorage.supplier || "[]")
  const express = JSON.parse(localStorage.express || "[]")
  $('#supplierSelecter').append(makSelect('order-supplier', supplier))
  $('#customerSelecter').append(makSelect('order-customer', customer))
  $('#expressSelecter').append(makSelect('order-express', express, true))
  $('#abExpressSelecter').append(makSelect('order-abExpress', express, true))
  const goodsHTML = $('#cardContainer .card')[0].outerHTML

  bindDelBtn()

  $('#addGoods').click(function () {
    const $this = $(this)
    $("#cardContainer").append(goodsHTML)
    bindDelBtn()
  })

  flatpickr("#orderDate", {
    dateFormat: "Y/m/d",
  });
  flatpickr("#orderExpressDate", {
    dateFormat: "Y/m/d",
    position: 'above'
  });
}

function exportData() {
  let order = {}
  let goods = []
  let $inputs = $('#orderFormDialog').find('input,select');
  $inputs.each(function () {
    if (!$(this).parents('#cardContainer').length) {
      const name = this.name.replace('order-', '')
      order[name] = this.value
    }
  })
  $("#cardContainer .card").each(function (i) {
    goods.push({})
    let $inputs = $(this).find('input,select');
    $inputs.each(function () {
      const name = this.name.replace('order-', '')
      goods[i][name] = this.value
    })
  })
  order.goods = goods
  order.createTime = new Date().getTime()
  order.date = order.date ? new Date(order.date).getTime() : ""
  order.dataType = 'order'
  return order
}


function edit(db, table, id) {
  db.findOne({
    _id: id,
    dataType: 'order'
  }).exec((err, ret) => {
    if (err) return layer.msg(err)
    layer.open({
      type: 1,
      content: require('../orderForm.js'),
      area: ['95%', '95%'],
      btnAlign: "c",
      btn: ["保存", "取消"],
      success() {

        initForm()
        const $inputs = $('#orderFormDialog').find('input,select')
        ret.date = dayjs(ret.date).format('YYYY/MM/DD')

        for (const key in ret) {
          if (ret.hasOwnProperty(key)) {
            const el = ret[key];
            $('[name=order-' + key + ']').val(el)
          }
        }
        const goods = ret.goods
        if (goods.length > 1) {
          for (let i = 1; i < goods.length; i++) {
            $('#addGoods').click()
          }
        }
        const goodsCard = $('#cardContainer .card')
        goods.forEach((el, i) => {
          for (const key in el) {
            if (el.hasOwnProperty(key)) {
              const goodsValue = el[key];
              goodsCard.eq(i).find('[name=order-' + key + ']').val(goodsValue)
            }
          }
        })
      },
      yes() {
        const order = exportData()
        loading("保存中..")

        db.update({
          _id: id
        }, {
          $set: order
        }, (err, res) => {
          layer.closeAll()
          if (!err) {
            layer.msg("保存成功")
            app.loadList()
          } else {
            layer.msg(err)
          }

        })
      }
    })

  })

}




module.exports = {
  init,
  edit
}