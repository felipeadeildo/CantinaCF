import { TUser } from "@/types/user"
import { useCallback, useState } from "react"



export const ComboboxUsers = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<TUser | undefined>()

  const handleSetActive = useCallback((user: TUser) => {
    setSelected(user)
  }, [])

  return <></>

}