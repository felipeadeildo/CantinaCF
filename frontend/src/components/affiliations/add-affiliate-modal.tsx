import { TUser } from "@/types/user"
import { Loader, Plus } from "lucide-react"
import { SimpleTooltip } from "../simple-tooltip"
import { Button } from "../ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAffiliatesMutation } from "@/hooks/affiliates"
import { useState } from "react"
import { ComboboxUsers } from "../combobox/users"

type Props = {
  forUser?: TUser
}

export const AddAffiliateModal = ({ forUser }: Props) => {
  const { addAffiliateMutation } = useAffiliatesMutation()
  const [user, setUser] = useState<TUser | undefined>()

  if (!forUser) return null

  return (
    <Dialog>
      <SimpleTooltip message="Adicionar novo affiliado">
        <DialogTrigger>
          <Button variant="secondary" size="sm">
            <Plus className="mr-1 size-4" />
          </Button>
        </DialogTrigger>
      </SimpleTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escolher novo afiliado para {forUser.name}</DialogTitle>
          <DialogDescription>
            Adicionar determinado afiliado como afiliado de {forUser.name} significa que o
            usuário selecionado poderá solicitar recargas do tipo &quot;Pagamento
            Posterior&quot; que, se aceito, adicionrá saldo devedor na conta do afiliador
            e crédito na conta do usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center gap-4">
          <ComboboxUsers onUserSelected={setUser} />

          {user && (
            <Button
              size="sm"
              className="w-full mt-4"
              onClick={() => addAffiliateMutation.mutate({ user, forUser })}
              disabled={addAffiliateMutation.isPending}
            >
              Adicionar afiliado
            </Button>
          )}

          {addAffiliateMutation.isPending && (
            <div className="flex justify-center items-center gap-2">
              <Loader className="w-4 h-4" /> Carregando...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
