"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (searchParams.has("authToastMsg")) {
      toast({
        title: "Acesso Negado",
        description: searchParams.get("authToastMsg") || "",
        variant: "destructive",
      })
      // cleanup the querystring:
      router.replace(pathname, undefined)
    }
  }, [searchParams, toast, router, pathname])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
