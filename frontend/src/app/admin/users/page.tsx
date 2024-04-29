"use client"
import { useUsers } from "@/hooks/users"
import { CircleAlert, Pencil, Search, User } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import CreateUserDialog from "@/components/admin/users/create-user-dialog"
import { LoginRequired } from "@/components/login-required"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { maskMoney } from "@/lib/masks"
import Link from "next/link"

const Users = () => {
  const [query, setQuery] = useState("")
  const [onlyBalance, setOnlyBalance] = useState(false)
  const [onlyBalancePayroll, setOnlyBalancePayroll] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const {
    data: users = [],
    isLoading,
    error,
  } = useUsers(query, onlyBalance, onlyBalancePayroll)

  return (
    <>
      <h1 className="text-xl font-semibold text-center my-2">Usuários</h1>

      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Search size={15} />
            <Input
              ref={searchRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(searchRef.current?.value || "")
                }
              }}
              placeholder="Digite e tecle Enter para pesquisar"
              className="my-2"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only_balance"
                checked={onlyBalance}
                onCheckedChange={() => {
                  console.log("chegou aqui")
                  setOnlyBalance((prev) => !prev)
                }}
              />
              <label htmlFor="only_balance">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Saldo positivo
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="only_balance_payroll"
                checked={onlyBalancePayroll}
                onCheckedChange={() => setOnlyBalancePayroll((prev) => !prev)}
              />
              <label htmlFor="only_balance_payroll">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Saldo devedor
                </span>
              </label>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">Nome</TableHead>
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">Matrícula</TableHead>
              <TableHead className="text-center">Saldo / Saldo Devedor</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-center">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.matricula || "Sem Matrícula"}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    <span className="text-green-500">{maskMoney(user.balance)}</span>
                    <span>/</span>
                    <span className="text-red-500">
                      {maskMoney(user.balance_payroll)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="flex justify-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" size="sm">
                          <Link href={`/profile?userId=${user.id}`}>
                            <User size={16} />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Perfil</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {users.length === 0 && !isLoading && (
          <Alert variant="destructive" className="mt-4">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>
              Nenhum resultado encontrado para &quot;{query}&quot;
            </AlertDescription>
          </Alert>
        )}

        {isLoading && <p className="mt-4 text-center">Carregando...</p>}

        <CreateUserDialog />
      </div>
    </>
  )
}

const ProtectedUsers = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <Users />
    </LoginRequired>
  )
}

export default ProtectedUsers
