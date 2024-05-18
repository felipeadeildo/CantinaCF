import { SimpleTooltip } from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CirclePlus } from "lucide-react"
import CreateUserForm from "./create-user-form"

const CreateUserDialog = () => {
  return (
    <Dialog>
      <SimpleTooltip message="Criar novo usuário.">
        <DialogTrigger asChild>
          <Button className="mt-4 fixed right-5 bottom-5" size="icon">
            <CirclePlus />
          </Button>
        </DialogTrigger>
      </SimpleTooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
          <DialogDescription>
            Crie um novo usuário e defina o cargo dele.
          </DialogDescription>
        </DialogHeader>

        <CreateUserForm />
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserDialog
