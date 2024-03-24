"use client"

import { getErrorMessage, getResponseErrorMessage } from "@/lib/utils"
import { TUser } from "@/types/user"
import axios, { AxiosError } from "axios"
import { createContext, useContext, useEffect, useState } from "react"

type TAuthContext = {
  user: TUser | null
  token: string | null
  isLoading: boolean
  setToken?: React.Dispatch<React.SetStateAction<string | null>>
  setUser?: React.Dispatch<React.SetStateAction<TUser | null>>
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<TAuthContext>({
  user: null,
  token: null,
  login: () => Promise.resolve({ ok: false }),
  logout: () => {},
  isLoading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      const res = await axios.post("/api/login", {
        username,
        password,
      })
      if (res.status === 200) {
        setToken(res.data.token)
        localStorage.setItem("token", res.data.token)
        return { ok: true }
      }
      return { ok: false, error: getResponseErrorMessage(res) }
    } catch (e: AxiosError | any) {
      return { ok: false, error: getErrorMessage(e) }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      if (!token) return setIsLoading(false)
      try {
        const res = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUser(res.data.user)
      } catch (e) {
        // console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [token])

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, setToken, setUser, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
