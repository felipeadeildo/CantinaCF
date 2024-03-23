"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { SideBar } from "./sidebar"

const NavBar = () => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderThemeToggle = () => {
    if (!mounted) return null
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    )
  }

  return (
    <nav className="flex justify-between items-center p-2 bg-primary">
      <div className="flex items-center">
        <Image src="/img/logo.png" alt="Logo" width={27} height={27} />
        <span className="ml-2 text-primary-foreground font-semibold">CantinaCF</span>
      </div>

      <div className="flex gap-2 items-center justify-center">
        {renderThemeToggle()}
        <SideBar />
      </div>
    </nav>
  )
}

export default NavBar
