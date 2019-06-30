const {
  ipcRender
} = require('electron')
const {
  getOne
} = require('./db/mysql/model/goodsModel')

window.addEventListener('DOMContentLoaded', () => {
  const $form = document.querySelector('form')
  const keywords = document.querySelector('input').value.trim()

  $form.addEventListener('submit', function (event) {
    event.preventDefault()
    if (keywords) {
      ipcRender.send('search', keywords)
    } else {
      alert('请填写搜索关键词')
    }
    return false
  })


  getOne('54-06-8')

})