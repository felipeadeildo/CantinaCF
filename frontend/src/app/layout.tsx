import NavBar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cantina",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}