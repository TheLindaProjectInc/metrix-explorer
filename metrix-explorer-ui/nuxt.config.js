import webpack from 'webpack'

export default {
  mode: 'universal',
  loading: "@/components/loading",
  head: {
    titleTemplate: '%s - metrix.info',
    meta: [
      { charset: 'utf-8' }
      //{ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=yes' }
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
          || 'https://metrix.info/api/'),
        'process.env.metrixinfoWSBase': JSON.stringify(process.env.METRIXINFO_WS_BASE
          || process.env.METRIXINFO_API_BASE_WS
          || '//metrix.info/'),
        'process.env.network': JSON.stringify(process.env.METRIX_NETWORK || 'mainnet')
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
