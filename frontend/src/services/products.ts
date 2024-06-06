import { getErrorMessage } from "@/lib/utils"
import { LoginFormInputs } from "@/schemas/login"
import { ProductStockInput } from "@/schemas/product"
import { TProduct } from "@/types/products"
import axios, { AxiosError } from "axios"

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

export const confirmPurchase = async (
  token: string | null,
  credentials: LoginFormInputs
): Promise<string> => {
  try {
    const res = await axios.post("/api/purchase", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data.message
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}

export const updateProduct = async (
  token: string | null,
  productId: number,
  name: string,
  value: number,
  quantity: number
): Promise<{ message: string }> => {
  try {
    const res = await axios.put(
      "/api/products",
      { id: productId, name, value, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}

export const addProductStock = async (
  token: string | null,
  product: ProductStockInput
): Promise<{ message?: string; product?: TProduct }> => {
  try {
    const res = await axios.post("/api/products", product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (e: AxiosError | any) {
    throw Error(getErrorMessage(e))
  }
}
