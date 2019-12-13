 //自动备份
 const fs = require('fs-extra');
 const path = require('path')
 const {
   copyFile
 } = require('../utils')

 function checkBackup(app,callback) {
   //数据文件存放地
   const dbFile = path.join(app.getPath('userData'), '/db/local/order.db')
   //備份文件存放地
   const backupPath = path.join(app.getPath('userData'), '/db/backup')
   console.log(backupPath);
   fs.ensureDir(backupPath,()=>{
        //确保文件存在
        fs.ensureFile(dbFile,()=>{
          //備份文件
          copyFile(dbFile,backupPath,true)
            //遍歷備份文件
          const files = fs.readdirSync(backupPath)
          
          removeDb(app,files)

          callback && callback()

        })
   })
   
   
 }

//移除超期的文件
function removeDb(app,files) {
  let dbFiles = files.filter(el=>/.+\.db$/.test(el))
  const maxFileLength = 25
  if(dbFiles.length > maxFileLength){
    dbFiles.reverse()
    dbFiles.forEach((el,i) => {
      if(i>maxFileLength){
        try {
          fs.removeSync(path.join(app.getPath('userData'), '/db/backup/' + el))
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}

 module.exports = {
   checkBackup
 }