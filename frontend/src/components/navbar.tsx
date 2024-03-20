"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

const NavBar = () => {
  const { setTheme, theme } = useTheme()

  return (
    <nav className="flex justify-between items-center p-2 bg-primary">
      <div className="flex items-center">
        <Image src="/img/logo.png" alt="Logo" width={27} height={27} />
        <span className="ml-2 text-primary-foreground font-semibold">CantinaCF</span>
      </div>

      <span className="text-primary-foreground">Opções Aqui</span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </nav>
  )
}

export default NavBar
