import NavBar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { useState } from "react"
import "./globals.css"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CantinaCF",
  description: "Cantina Escolar",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/img/fantastico.ico" />
      </head>
      <body className={inter.className}>
        {/* Envolve os componentes com o QueryClientProvider */}
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <NavBar />
              <Toaster />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
