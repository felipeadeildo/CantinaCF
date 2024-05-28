"use client"

import { getErrorMessage } from "@/lib/utils"
import { TUser } from "@/types/user"
import axios, { AxiosError } from "axios"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TAuthContext = {
  user: TUser | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<TAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchUser = useCallback(async (currentToken: string) => {
    setIsLoading(true)
    try {
      const res = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })
      setUser(res.data.user)
    } catch (error) {
      console.error("Erro ao buscar usuário:", getErrorMessage(error as AxiosError))
      // Considerar fazer logout ou outra ação
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [fetchUser])

  const login = async (
    username: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/login", { username, password })
      if (res.data.token) {
        setToken(res.data.token)
        localStorage.setItem("token", res.data.token)
        await fetchUser(res.data.token)
        setIsLoading(false)
        return { ok: true }
      } else {
        setIsLoading(false)
        throw { ok: false, error: "Nenhum token recebido do servidor" }
      }
    } catch (error) {
      setIsLoading(false)
      return { ok: false, error: getErrorMessage(error as AxiosError) }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    setIsLoading(false)
  }

  const contextValue = {
    user,
    token,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = (): TAuthContext => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
