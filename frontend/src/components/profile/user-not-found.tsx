import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const UserNotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <Alert variant="destructive" className="mt-64 w-3/5">
        <AlertDescription className="flex flex-col items-center gap-2 justify-center">
          Usuário não encontrado.
          <Button variant="outline" asChild>
            <Link href={"/admin/users"}>Lista de Usuários</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
