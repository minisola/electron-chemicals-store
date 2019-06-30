const {
  ipcRenderer
} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const $form = document.querySelector('form')
  $form.addEventListener('submit', function (event) {
    const keywords = document.querySelector('input').value.trim()
    event.preventDefault()
    console.log(keywords);
    if (keywords) {
      ipcRenderer.send('search', keywords)
    } else {
      alert('请填写搜索关键词')
    }
    return false
  })
})
