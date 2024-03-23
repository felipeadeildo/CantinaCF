import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CirclePlus } from "lucide-react"
import CreateUserForm from "./create-user-form"

const CreateUserDialog = () => {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="mt-4 fixed right-5 bottom-5" size="icon">
                <CirclePlus />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Criar Novo Usuário</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
