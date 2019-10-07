const {
    Op,
    Sequelize
} = require('sequelize')

let Goods = null
let Mysql = null

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
        Mysql = require('../mysql')
        Goods = Mysql.import('../schema/goods');

        const limit = 10
        const res = await Goods.findAndCountAll({
            order: [
                ['id', 'DESC']
              ],
            where: {
                [Op.or]: [{
                        goodsname: keywords
                    },
                    {
                        mdl: keywords
                    },
                    {
                        sumformula: keywords
                    },
                    {
                        goodscas:keywords
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