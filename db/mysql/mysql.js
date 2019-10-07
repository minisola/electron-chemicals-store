const Sequelize =  require('sequelize')
const Store = require('electron-store');
const store = new Store();

const account = store.get('account')
const password = store.get('password')
const port = store.get('port')
const server = store.get('server')

console.log(`mysql://${account}:${password}@${server}:${port}/hopschem`);

const Mysql = new Sequelize(`mysql://${account}:${password}@${server}:${port}/hopschem`);

// const mysql = new Sequelize("mysql://root:root@localhost:3306/test");
module.exports = Mysql