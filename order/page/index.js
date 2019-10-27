const Vue = require('vue/dist/vue')
require('xe-utils')
const VXETable =require('vxe-table/lib/index') 
Vue.use(VXETable)


const app = new Vue({

    data:{
        tableData: [{
          index:0,
          role:1,
          name:2,
          sex:1,
          date12:12,
          address:32323
        }],
        sexList:[
          {label: "", spell: "", value: "", value2: null, val: ""},
          {label: "男", spell: "nan", value: "1", value2: 1, val: "x"},
          {label: "女", spell: "nv", value: "0", value2: 0, val: "o"}
        ],
    },
    created () {
    },
    methods: {
      editRowEvent (row) {
        this.$refs.xTable.setActiveRow(row)
      },
      saveRowEvent (row) {
        this.$refs.xTable.clearActived().then(() => {
          this.$XModal.alert('success')
        })
      },
      cancelRowEvent (row) {
        this.$refs.xTable.clearActived()
      }
    }
  }).$mount("#orderTalbe")