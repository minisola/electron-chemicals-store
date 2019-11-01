const flatpickr = require("flatpickr");
const {
  makSelect,
  loading
} = require('../../utils')
const dayjs = require('dayjs')


function init(db, table) {

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

        db.insert(order, (err, res) => {
          layer.closeAll()

          if (!err) {
            layer.msg("保存成功")
            table.loadList()
          } else {
            layer.msg(err)
          }

        })
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
  $('#expressSelecter').append(makSelect('order-express', express))
  $('#abExpressSelecter').append(makSelect('order-abExpress', express))
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


function edit(db,table,id) {
  console.log(table);
  console.log(id);
  db.findOne({
    _id:id,
    dataType:'order'
  }).exec((err,ret)=>{
    if(err) return layer.msg(err)
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
        if(goods.length>1){
          for (let i = 1; i < goods.length; i++) {
            $('#addGoods').click()
          }
        }
        const goodsCard = $('#cardContainer .card')
        goods.forEach((el,i)=>{
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
        console.log(order);
        loading("保存中..")


        db.update({
          _id:id
        },{
          $set:order
        }, (err, res) => {
          layer.closeAll()
          if (!err) {
            layer.msg("保存成功")
            table.loadList()
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