/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_goods_ch', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goodsname: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    goodsno: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    goodscas: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    mdl: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    sumformula: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    mulecularWeight: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    choline: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    createtime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    showimg: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    gys: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 't_goods_ch',
    timestamps: false
  });
};
