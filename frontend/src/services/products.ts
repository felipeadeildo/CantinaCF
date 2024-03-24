import { getErrorMessage } from "@/lib/utils"
import { TProduct } from "@/types/products"
import axios, { Axios, AxiosError } from "axios"

export const fetchProducts = async (
  token: string | null,
  query: string
): Promise<{ message?: string; products?: TProduct[] }> => {
  try {
    const res = await axios.get("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        query,
      },
    })

    return {
      products: res.data.products,
    }
  } catch (e: AxiosError | any) {
    return { message: getErrorMessage(e) }
  }
}

export const addProductToCart = async (
  token: string | null,
  productId: number
): Promise<{ message?: string }> => {
  try {
    const res = await axios.post(
      "/api/cart",
      {
        id: productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return { message: res.data.message }
  } catch (e) {
    return { message: getErrorMessage(e as AxiosError) }
  }
}

export const removeProductFromCart = async (
  token: string | null,
  productId: number
): Promise<{ message?: string }> => {
  try {
    const res = await axios.delete(`/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        product_id: productId,
      },
    })
    return { message: res.data.message }
  } catch (e) {
    return { message: getErrorMessage(e as AxiosError) }
  }
}
