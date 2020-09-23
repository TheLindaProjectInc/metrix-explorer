export default {
  mainnet: {
    pubkey: 0x32,
    pubkeyhash: 0x32,
    scripthash: 0x55,
    witness_v0_keyhash: 'mc',
    witness_v0_scripthash: 'mc'
  },
  testnet: {
    pubkey: 0x6E,
    pubkeyhash: 0x6E,
    scripthash: 0xBB,
    witness_v0_keyhash: 'tm',
    witness_v0_scripthash: 'tm'
  }
}[process.env.network || 'mainnet']
