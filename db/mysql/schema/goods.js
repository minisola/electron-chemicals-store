/* jshint indent: 2 */

const {
  Sequelize
} = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    goodsname: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    goodsno: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    goodscas: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    mdl: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    sumformula: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    mulecularWeight: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    choline: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    showimg: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    gys: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'goods',
    timestamps: false
  });
};
