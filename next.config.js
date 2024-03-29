const path = require('path')

const isDev =
  process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

module.exports = withMDX({
  pageExtensions: ['jsx', 'js', 'md', 'mdx'],
  assetPrefix: isDev ? '' : 'https://compliance-users.carbonplan.org',
})
