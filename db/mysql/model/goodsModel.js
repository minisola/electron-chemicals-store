const {
    Op,
    Sequelize
} = require('sequelize')

const Store = require('electron-store');
const store = new Store();

let Mysql = null
let Goods = null

module.exports = {
    async getList(page = 1, rows, keywords) {
        const limit = rows ? Number(rows) : 10
        const offset = (page - 1) * limit;
        const res = await Goods.findAndCountAll({
            limit,
            offset,
            raw: true
        })
        return {
            rows: res.rows,
            total: res.count
        }
    },
    async getOne(keywords = '') {
        const reset = store.get('reset')
        if(reset){
            Mysql = null
            store.set('reset',0)
        }
        if (!Mysql) {
            const {account,password} = store.get('account')
            Mysql = new Sequelize(`mysql://${account}:${password}@localhost:3306/test`);
            Goods = Mysql.import('../schema/t_goods_ch');
        }
        const limit = 10
        const res = await Goods.findAndCountAll({
            where: {
                [Op.or]: [{
                        goodsname: keywords
                    },
                    {
                        mdl: keywords
                    },
                    {
                        sumformula: keywords
                    }
                ]
            },
            limit,
            raw: true
        })
        return {
            rows: res.rows,
            total: res.count
        }
    },
}