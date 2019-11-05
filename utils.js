const utils = {}
const fs = require('fs-extra');
const path = require('path')

const dbFile = path.join(__dirname, 'db/local/order.db')

utils.backup = (dialog,callback) => {
    dialog.showOpenDialog({
        //选择操作，此处是打开文件夹
        properties: [
            'openDirectory',
        ],
        //过滤条件
        filters: [{
            name: 'All',
            extensions: ['*']
        }, ]
    }, function (res) {
        //回调函数内容，此处是将路径内容显示在input框内
        if (res) {
            const loading = utils.loading("备份中..")
            utils.copyFile(dbFile,res[0],false,()=>{
                layer.close(loading)
                callback&&callback()
            })
           
        }
    })
}

utils.copyFile = (sourcePath = dbFile,targetPath,isTimestamp = false,callback)=>{
    let currentTime = new Date()
    let timeString = isTimestamp ? currentTime.getTime()  : (currentTime.getFullYear().toString() +
        currentTime.getMonth().toString() +
        currentTime.getDate().toString() +
        currentTime.getHours().toString() +
        currentTime.getMinutes().toString() +
        currentTime.getSeconds().toString())
    fs.copy(sourcePath, path.join(targetPath, `backup-${timeString}.db`))
        .then(() => {
            callback && callback()
        })
        .catch(err => {
            callback && callback(err)
        })
}

utils.recover = (path,dialog,callback) => {
    path = path ? path : dialog.showOpenDialog({
        filters: [{
            name: '数据库备份文件',
            extensions: ['db']
        }],
        properties: ['openFile'],
        message: '选择要导入的数据备份文件',
        buttonLabel: '导入'
    })
    if (path) {
        const loading = utils.loading("恢复中..")
        const recoverDbFile = path[0]
        try {
            fs.copySync(recoverDbFile, dbFile)
            layer.close(loading)
            callback && callback()
        } catch (err) {
            layer.close(loading)
            callback && callback(err)
        }
    }
}

utils.makSelect = (name,list)=>{
    let html = ` <select name="${name}" class="custom-select d-block w-100">`
    const options = (list.map(el=>`<option value="${el.name}">${el.name}</option>`)).join(',')
    html +=options
    html+=`</select>`
    return html
}

utils.loading = (text, params) => {
    const options = Object.assign({}, {
        icon: 16,
        time: 0,
        shade: [0.3, '#000']
    }, params || {})
    return layer.msg(text || "载入中", options)
}

module.exports = utils