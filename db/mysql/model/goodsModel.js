const Mysql = require('../mysql') // 引入MySQL数据库
const Goods = Mysql.import('../schema/t_goods_ch');
const { Op } = require('sequelize')


module.exports = {
     async getList(page = 1, rows, keywords) {
        const limit = rows ? Number(rows) : 10
        const offset = (page - 1) * limit;
        const res = await Goods.findAndCountAll({
            limit,
            offset,
            raw: true
        })
        console.log(res.rows);
        return {
            rows: res.rows,
            total: res.count
        }
    },
    async getOne(keywords= '') {
        const limit = 10
        const res = await Goods.findAll({
            where:{
                [Op.or]:[
                    {goodscas:keywords},
                    {mdl:keywords},
                    {sumformula:keywords}
                ]
            },
            limit,
            raw: true
        })
        console.log(res);
        return {
            rows: res,
            total: res.count
        }
    },
}