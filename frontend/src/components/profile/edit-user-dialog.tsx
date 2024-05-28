import { Button } from "@/components/ui/button"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { TUser } from "@/types/user"
import { Pen } from "lucide-react"
import { EditUserCard } from "./edit-user-card"

type Props = {
  user: TUser
  children?: React.ReactNode
}

export const EditUserDialog = ({ user, children }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="secondary" size="sm" className="text-xs">
            <Pen className="mr-1 size-4" /> Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <EditUserCard user={user} />
      </DialogContent>
    </Dialog>
  )
}
