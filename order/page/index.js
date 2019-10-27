const flatpickr = require("flatpickr");
const Vue = require('vue/dist/vue')
require('xe-utils')
const VXETable = require('vxe-table/lib/index')
const {
  makSelect
} = require('../../utils')
Vue.use(VXETable)


const formHtml = document.querySelector("#orderForm").innerHTML

$("#orderAdd").on('click', function () {
  layer.open({
    type: 1,
    content: require('../orderForm.js'),
    area: ['90%', '90%'],
    btnAlign: "c",
    btn: ["保存", "取消"],
    success() {
      const customer = JSON.parse(localStorage.customer || "[]")
      const supplier = JSON.parse(localStorage.supplier || "[]")
      const express = JSON.parse(localStorage.express || "[]")
      $('#supplierSelecter').append(makSelect('order-supplier', supplier))
      $('#customerSelecter').append(makSelect('order-customer', customer))
      $('#expressSelecter').append(makSelect('order-express', express))
      const goodsHTML = $('.card')[0].outerHTML
      $('#delGoods').click(function(){
        const $this =  $(this)
        layer.confirm('确认删除此项?',function (index) {
          $this.parents('.card').remove()
          layer.close(index)
        })
      })
      $('#addGoods').click(function(){
        const $this =  $(this)
        layer.confirm('确认删除此项?',function (index) {
          $this.parents('.card').remove()
          layer.close(index)
        })
      })
      flatpickr("#orderDate", {
        dateFormat: "Y/m/d",
      });
      flatpickr("#orderExpressDate", {
        dateFormat: "Y/m/d",
        position:'above'
      });






    },
    yes(){
      console.log('save');
    }
  })
})





const app = new Vue({
  data: {
    tableData: [{
      index: 0,
      role: 1,
      name: 2,
      sex: 1,
      date12: 12,
      address: 32323
    }],
    sexList: [{
        label: "",
        spell: "",
        value: "",
        value2: null,
        val: ""
      },
      {
        label: "男",
        spell: "nan",
        value: "1",
        value2: 1,
        val: "x"
      },
      {
        label: "女",
        spell: "nv",
        value: "0",
        value2: 0,
        val: "o"
      }
    ],
  },
  created() {},
  methods: {
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        this.$XModal.alert('success')
      })
    },
    cancelRowEvent(row) {
      this.$refs.xTable.clearActived()
    }
  }
}).$mount("#orderTalbe")