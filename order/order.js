const {
  ipcRenderer
} = require('electron')

const CustomerInit = require("./page/customer")


const nedb = require('nedb');

// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
  filename: './db/local/order.db',
  autoload: true
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('start');

  //导航
  $("#sider-nav a").on('click', function () {
    const index = $(this).index()
    $(this).addClass('active').siblings().removeClass('active')

    switch (index) {
      case 0:

        break;
      case 1:
        CustomerInit(db)
        break;
      default:
        break;
    }





  })

})