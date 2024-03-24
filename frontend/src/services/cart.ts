import { TCart } from "@/types/cart"
import axios from "axios"

export const fetchCart = async (token: string | null): Promise<TCart[]> => {
  try {
    const res = await axios.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  } catch (e) {
    return []
  }
}
