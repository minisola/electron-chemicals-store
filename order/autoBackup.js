 //自动备份
 const fs = require('fs-extra');
 const path = require('path')
 const {
   copyFile
 } = require('../utils')

 function checkBackup(params) {
   //数据文件存放地
   const dbFile = path.join(__dirname, '../db/local/order.db')
   //備份文件存放地
   const backupPath = path.join(__dirname, '../db/backup')
   //确保文件存在
   fs.ensureFile(dbFile,()=>{
    //備份文件
    copyFile(dbFile,backupPath,true)
       //遍歷備份文件
    const files = fs.readdirSync(backupPath)
    
    removeDb(files)
   })
 }

//移除超期的文件
function removeDb(files) {
  let dbFiles = files.filter(el=>/.+\.db$/.test(el))
  const maxFileLength = 15
  if(dbFiles.length > maxFileLength){
    dbFiles.reverse()
    dbFiles.forEach((el,i) => {
      if(i>maxFileLength){
        try {
          fs.removeSync(path.join(__dirname, '../db/backup/' + el))
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