import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { SIDEBAR_PAGES, SIDEBAR_PAGES_CATEGORIES } from "@/constants/pages"
import { useAuth } from "@/contexts/auth"
import { AlignLeftIcon, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

export const SideBar = () => {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const getPages = useCallback(
    (category: string) => {
      return SIDEBAR_PAGES.filter(
        (page) =>
          page.allowed_roles.includes(user?.role_id as number) &&
          page.category === category
      )
    },
    [user]
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <AlignLeftIcon size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-semibold text-center">CantinaCF</SheetTitle>
          <SheetDescription className="text-sm text-center">
            Feito com ❤️ por Felipe Adeildo
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
          {SIDEBAR_PAGES_CATEGORIES.map((category) => (
            <div key={category}>
              {getPages(category).length > 0 && (
                <p className="font-semibold text-sm text-center py-2">{category}</p>
              )}
              <div className="px-3 space-y-2">
                {getPages(category).map((page) => (
                  <Button
                    key={page.path}
                    variant="ghost"
                    className="w-full justify-start border-t-2"
                  >
                    <Link
                      href={page.path}
                      className="flex items-center gap-3 text-sm font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <page.icon size={18} />
                      {page.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-6 border-t pt-4">
            <Button variant="ghost" asChild>
              <Link
                href="/auth/logout"
                className="w-full flex gap-1 justify-center items-center"
                onClick={() => setOpen(false)}
              >
                <LogOutIcon size={18} />
                Sair
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
