import NavBar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ChartJsProvider } from '@/contexts/chartjs'
import { Suspense } from 'react'
import './globals.css'
import Loading from './loading'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CantinaCF -  Colégio Fantástico',
  description: 'Site da Cantina do Colégio Fantástico!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/fantastico.ico" />
        {/* <!-- Primary Meta Tags --> */}
        <title>CantinaCF - Colégio Fantástico</title>
        <meta name="title" content="CantinaCF - Colégio Fantástico" />
        <meta
          name="description"
          content="Site da Cantina do Colégio Fantástico!
Feito com  ❤️ por @felipeadeildo."
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        {/* TODO: Adicionar uma variável de ambiente para setar o domínio */}
        {/* <meta property="og:url" content="http://localhost:3000" /> */}
        <meta property="og:title" content="CantinaCF - Colégio Fantástico" />
        <meta
          property="og:description"
          content="Site da Cantina do Colégio Fantástico!
Feito com  ❤️ por @felipeadeildo."
        />
        <meta property="og:image" content="/img/logo.png" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        {/* TODO: Adicionar uma variável de ambiente para setar o domínio */}
        {/* <meta property="twitter:url" content="http://localhost:3000" /> */}
        <meta
          property="twitter:title"
          content="CantinaCF - Colégio Fantástico"
        />
        <meta
          property="twitter:description"
          content="Site da Cantina do Colégio Fantástico!
Feito com  ❤️ por @felipeadeildo."
        />
        <meta property="twitter:image" content="/img/logo.png" />

        {/* <!-- Meta Tags Generated with https://metatags.io --> */}
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ChartJsProvider>
              <AuthProvider>
                <NavBar />
                <Suspense fallback={null}>
                  <Toaster />
                </Suspense>
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </AuthProvider>
            </ChartJsProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
