export default {
  mainnet: {
    pubkey: 0x3a,
    pubkeyhash: 0x3a,
    scripthash: 0x32,
    witness_v0_keyhash: 'qc',
    witness_v0_scripthash: 'qc'
  },
  testnet: {
    pubkey: 0x6E,
    pubkeyhash: 0x6E,
    scripthash: 0xBB,
    witness_v0_keyhash: 'tm',
    witness_v0_scripthash: 'tm'
  }
}[process.env.network || 'mainnet']
