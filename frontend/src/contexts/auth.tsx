"use client"

import axios from "axios"
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
}

const AuthContext = createContext<TAuthContext>({
  user: null,
  token: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user", {
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
    <AuthContext.Provider value={{ user, token, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
