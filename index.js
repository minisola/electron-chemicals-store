const {
  ipcRenderer
} = require('electron')

const Store = require('electron-store');
const store = new Store();

//获取账号密码信息

const account = store.get('account')

if(!account) getDbInfo()

//重置账号密码
ipcRenderer.on('reset',function () {
  store.set('reset',1)
  getDbInfo()
})

function getDbInfo() {
  const data = {
    account: '',
    password: ''
  }
  layer.prompt({
    title: '请输入账号',
    formType: 0,
    closeBtn: 0,
    btn2: function () {
      ipcRenderer.send('quit')
    }
  }, function (text, index) {
    if (!text.trim()) return false
    data.account = text
    layer.close(index)
    layer.prompt({
      title: '请输入密码',
      closeBtn: 0,
      formType: 1,
      btn2: function () {
        ipcRenderer.send('quit')
      }
    }, function (pass, index) {
    if (!pass.trim()) return false
      data.password = pass
      saveAccount(data)
      layer.close(index);
    });
  });
}

function saveAccount (data){
  store.set('account',data)
}

window.addEventListener('DOMContentLoaded', () => {
  const $form = document.querySelector('form')
  $form.addEventListener('submit', function (event) {
    const keywords = document.querySelector('input').value.trim()
    event.preventDefault()
    console.log(keywords);
    if (keywords) {
      ipcRenderer.send('search', keywords)
    } else {
      layer.msg('请填写搜索关键词')
    }
    return false
  })
})