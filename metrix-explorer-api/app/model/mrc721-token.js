module.exports = app => {
  const {CHAR} = app.Sequelize

  let MRC721Token = app.model.define('mrc721_token', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    tokenId: {
      type: CHAR(32).BINARY,
      primaryKey: true
    },
    holder: CHAR(20).BINARY
  }, {freezeTableName: true, underscored: true, timestamps: false})

  MRC721Token.associate = () => {
    const {Contract} = app.model
    Contract.hasMany(MRC721Token, {as: 'mrc721Tokens', foreignKey: 'contractAddress'})
    MRC721Token.belongsTo(Contract, {as: 'contract', foreignKey: 'contractAddress'})
  }

  return MRC721Token
}
