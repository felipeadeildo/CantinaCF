import { getErrorMessage } from "@/lib/utils"
import { TBRechargesQuery } from "@/types/queries"
import { TPaymentMethod, TPaymentRequest } from "@/types/recharge"
import axios, { AxiosError } from "axios"

export const acceptOrDenyPayment = async (
  token: string | null,
  paymentId: number,
  accept: boolean
): Promise<{ message: string }> => {
  try {
    const res = await axios.put(
      "/api/recharge",
      { id: paymentId, accept },
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

export const fetchPaymentMethods = async (
  token: string | null
): Promise<{ message?: string; paymentMethods?: TPaymentMethod[] }> => {
  try {
    const res = await axios.get("/api/payment_methods", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return {
      paymentMethods: res.data,
    }
  } catch (e: AxiosError | any) {
    return { message: getErrorMessage(e) }
  }
}

type PaymentsPage = {
  nextPage: number | null
  payments: TPaymentRequest[]
  queryId: string
}

export const fetchPayments = async (
  token: string | null,
  query: TBRechargesQuery,
  page?: number
): Promise<PaymentsPage> => {
  try {
    const res = await axios.get("/api/recharge", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { ...query, page },
    })
    return res.data
  } catch (e: AxiosError | any) {
    throw Error(getErrorMessage(e))
  }
}

export const fetchPaymentRequests = async (
  token: string | null
): Promise<TPaymentRequest[]> => {
  try {
    const res = await axios.get("/api/payments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.payments
  } catch (e: AxiosError | any) {
    throw Error(getErrorMessage(e))
  }
}
