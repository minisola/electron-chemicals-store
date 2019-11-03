const {
  ipcRenderer
} = require('electron')

const Store = require('electron-store');
const store = new Store();

//获取账号密码信息

const account = store.get('account')

//充值账号密码窗口
let resetDialog = null
let resetFlag = 0

//重置账号密码
ipcRenderer.on('reset',()=>{
  getDbInfo(true)
})


/**
 * 设置远程服务器信息
 * @param {boolean} hasCloseBtn 是否允许显示关闭按钮
 */
function getDbInfo(hasCloseBtn) {
  if(resetFlag) return
  resetFlag= 1
  resetDialog = layer.open({
    type:1,
    content:$('.dialog-reset-hook'),
    area:['400px','220px'],
    title:false,
    closeBtn:false,
    btn:hasCloseBtn ?['保存','取消'] :['保存'],
    success:function () {
      $('[name=server]').focus()
    },
    yes:function () {
      saveInfo()
    },
    end:function () {
      resetFlag =0
    }
  })

  function saveInfo() {
    const data = {
      server: $('[name=server]').val(),
      password: $('[name=password]').val(),
      account: $('[name=account]').val(),
      port: $('[name=port]').val(),
    }
    if (!data.server) return layer.msg('请输入服务器地址')
    if (!data.port) return layer.msg('请输入服务器端口号')
    if (!data.account) return layer.msg('请输入账号')
    if (!data.password) return layer.msg('请输入密码')

    store.set('account',data.account)
    store.set('port',data.port)
    store.set('server',data.server)
    store.set('password',data.password)

    layer.close(resetDialog)
    resetFlag =0

    layer.confirm('配置保存成功，是否重启应用以生效？',function (index) {
      layer.close(index)
      ipcRenderer.send('relaunch')
    })



  }
}

window.addEventListener('DOMContentLoaded', () => {
    //检查是否有默认账号
    setTimeout(() => {
      if(!account) getDbInfo()
    }, 500);

  const $form = document.querySelector('form')
  $form.addEventListener('submit', function (event) {
    const keywords = document.querySelector('input').value.trim()
    event.preventDefault()
    if (keywords) {
      ipcRenderer.send('search', keywords)
    } else {
      layer.msg('请填写搜索关键词')
    }
    return false
  })
})