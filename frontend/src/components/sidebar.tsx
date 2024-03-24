import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { SIDEBAR_PAGES, SIDEBAR_PAGES_CATEGORIES } from "@/constants/pages"
import { AlignLeftIcon, LogOut, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export const SideBar = () => {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <AlignLeftIcon size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            CantinaCF
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500 dark:text-gray-400">
            Feito com ❤️ por Felipe Adeildo
          </SheetDescription>
        </SheetHeader>
        <div className="pt-4">
          {SIDEBAR_PAGES_CATEGORIES.map((category) => (
            <Accordion type="single" collapsible key={category}>
              <AccordionItem value={category}>
                <AccordionTrigger>
                  <span className="font-medium">{category}</span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1">
                  {SIDEBAR_PAGES.filter((page) => page.category === category).map(
                    (page) => (
                      <Link
                        key={page.path}
                        href={page.path}
                        className="px-4 py-2 text-sm  rounded-md"
                        onClick={() => setOpen(false)}
                      >
                        {page.name}
                      </Link>
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>

        <Button variant="ghost" asChild>
          <Link
            href="/auth/logout"
            className="w-full flex gap-1 justify-center items-center text-destructive hover:text-destructive/80"
            onClick={() => setOpen(false)}
          >
            <LogOutIcon size={18} />
            Sair
          </Link>
        </Button>
      </SheetContent>
    </Sheet>
  )
}
