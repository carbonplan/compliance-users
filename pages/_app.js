import React, { useEffect } from 'react'
import Script from 'next/script'
import { ThemeProvider } from 'theme-ui'
import { MDXProvider, useMDXComponents } from '@mdx-js/react'
import { useThemedStylesWithMdx } from '@theme-ui/mdx'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import useStore from '../components/use-store'
import Header from '../components/header'
import Layout from '../components/layout'
import Info from '../components/info'

const Analytics = () =>
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? (
    <Script
      strategy='lazyOnload'
      data-domain='carbonplan.org'
      data-api='https://carbonplan.org/proxy/api/event'
      src='https://carbonplan.org/js/script.file-downloads.outbound-links.js'
    />
  ) : null

const App = ({ Component, pageProps, router }) => {
  const data = useStore((state) => state.data)
  const fetch = useStore((state) => state.fetch)
  const components = useThemedStylesWithMdx(useMDXComponents())

  useEffect(() => {
    if (!data) fetch()
  }, [])

  if (router.route === '/404') {
    return (
      <ThemeProvider theme={theme}>
        <Analytics />
        <MDXProvider components={components}>
          <Component {...pageProps} />
        </MDXProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Analytics />
      <MDXProvider components={components}>
        <Layout>
          <Header />
          <Component {...pageProps} />
          <Info />
        </Layout>
      </MDXProvider>
    </ThemeProvider>
  )
}

export default App
