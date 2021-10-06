import webpack from 'webpack'

export default {
  mode: 'universal',
  loading: "@/components/loading",
  publicRuntimeConfig: {
    hostname: process.env.HOST_FQDN,
    hostprot: process.env.HOST_PROT,
  },
  privateRuntimeConfig: {},
  generate: {
    interval: 80,
    fallback: '404.html'
  },
  head: {
    titleTemplate: '%s - ' + process.env.HOST_FQDN,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' }
    ]
  },
  build: {
    extend(config, { isServer }) {
      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      })
      config.plugins.push(new webpack.DefinePlugin({
        'process.env.metrixinfoAPIBase': JSON.stringify(process.env.METRIXINFO_API_BASE
          || process.env[isServer ? 'METRIXINFO_API_BASE_SERVER' : 'METRIXINFO_API_BASE_CLIENT']
          || 'https://explorer.metrixcoin.com/api/'),
        'process.env.metrixinfoWSBase': JSON.stringify(process.env.METRIXINFO_WS_BASE
          || process.env.METRIXINFO_API_BASE_WS
          || '//explorer.metrixcoin.com/'),
        'process.env.network': JSON.stringify(process.env.METRIX_NETWORK || 'mainnet'),
        'process.env.hostprot': JSON.stringify(process.env.HOST_PROT || 'https:'),
        'process.env.wshost': JSON.stringify(process.env.WS_HOST || 'explorer.metrixcoin.com'),
        'process.env.wsprot': JSON.stringify(process.env.WS_PROT || 'ws:')
      }))
    },
    extractCSS: true,
    postcss: {
      features: {
        customProperties: false
      }
    }
  },
  modules: [
    '@nuxtjs/style-resources'
  ],
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@/icons/style.css',
    '@/styles/reset.css'
  ],
  styleResources: {
    less: ['./styles/mixins.less', './styles/variables.less']
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    }
  },
  serverMiddleware: ['~/middleware/ip.js'],
  plugins: [
    '~/plugins/components.js',
    '~/plugins/i18n.js',
    '~/plugins/metrix-utils.js',
    { src: '~/plugins/websocket.js', ssr: false }
  ]
}
