import React, { useEffect } from 'react'
import PlausibleProvider from 'next-plausible'
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

const App = ({ Component, pageProps, router }) => {
  const data = useStore((state) => state.data)
  const fetch = useStore((state) => state.fetch)
  const components = useThemedStylesWithMdx(useMDXComponents())

  useEffect(() => {
    if (!data) fetch()
  }, [])

  if (router.route === '/404') {
    return (
      <PlausibleProvider domain='carbonplan.org'>
        <ThemeProvider theme={theme}>
          <MDXProvider components={components}>
            <Component {...pageProps} />
          </MDXProvider>
        </ThemeProvider>
      </PlausibleProvider>
    )
  }

  return (
    <PlausibleProvider domain='carbonplan.org'>
      <ThemeProvider theme={theme}>
        <MDXProvider components={components}>
          <Layout>
            <Header />
            <Component {...pageProps} />
            <Info />
          </Layout>
        </MDXProvider>
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
