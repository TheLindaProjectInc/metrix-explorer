module.exports = app => {
  const {INTEGER, CHAR} = app.Sequelize

  let MRC20Statistics = app.model.define('mrc20_statistics', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    holders: INTEGER.UNSIGNED,
    transactions: INTEGER.UNSIGNED
  }, {freezeTableName: true, underscored: true, timestamps: false})

  MRC20Statistics.associate = () => {
    const {Mrc20: MRC20} = app.model
    MRC20Statistics.belongsTo(MRC20, {as: 'mrc20', foreignKey: 'contractAddress'})
    MRC20.hasOne(MRC20Statistics, {as: 'statistics', foreignKey: 'contractAddress'})
  }

  return MRC20Statistics
}
