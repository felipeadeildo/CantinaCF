import { Button } from "@/components/ui/button"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { TUser } from "@/types/user"
import { Pen } from "lucide-react"
import { EditUserCard } from "./edit-user-card"

type Props = {
  user: TUser
}

export const EditUserDialog = ({ user }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Pen className="mr-1 h-5 w-5" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <EditUserCard user={user} />
      </DialogContent>
    </Dialog>
  )
}
