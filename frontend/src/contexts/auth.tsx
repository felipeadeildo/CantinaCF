"use client"

import { getErrorMessage, getResponseErrorMessage } from "@/lib/utils"
import axios, { AxiosError } from "axios"
import { createContext, useContext, useEffect, useState } from "react"

type TUser = {
  id: number
  username: string
}

type TAuthContext = {
  user: TUser | null
  token: string | null
  setToken?: React.Dispatch<React.SetStateAction<string | null>>
  setUser?: React.Dispatch<React.SetStateAction<TUser | null>>
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
}

const AuthContext = createContext<TAuthContext>({
  user: null,
  token: null,
  login: () => Promise.resolve({ ok: false }),
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    try {
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
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return
      try {
        const res = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUser(res.data.user)
      } catch (e) {
        console.log(e)
      }
    }

    fetchUser()
  }, [token])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
