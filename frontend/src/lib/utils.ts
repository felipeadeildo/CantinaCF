import { TUser, UserRoles } from "@/types/user"
import { AxiosError, AxiosResponse } from "axios"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getResponseErrorMessage(response: AxiosResponse): string {
  const data = response.data as { message?: string; msg?: string }
  if (data && data.message) {
    return data.message
  } else if (data && data.msg) {
    return data.msg
  } else {
    return "Um erro inesperado aconteceu."
  }
}

export function getErrorMessage(error: AxiosError): string {
  if (!error) return "Um erro inesperado aconteceu."
  if (error.response) {
    return getResponseErrorMessage(error.response)
  } else if (error.request) {
    return "Sem resposta da API."
  } else {
    return error.message
  }
}

export const toReal = (value: number) => {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" })
}

export const isUserAdmin = (user: TUser) => {
  return user.role_id.toString() === UserRoles.Admin
}

export const getBackendUrl = (): string => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
}

export const getAttachUrl = (attachPath: string) => {
  return `/static/uploads/${attachPath}`
}
