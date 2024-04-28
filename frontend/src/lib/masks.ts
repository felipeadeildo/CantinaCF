export const maskMoney = (money: string) =>
  Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(money.replace(/\D/g, "")) / 100)

export const sanitizeFMoney = (money: string) => {
  return money.replace("R$", "").replace(".", ".").replace(",", ".").trim()
}

export const maskCPF = (input: string) => {
  const noMask = input.replace(/\D/g, "")
  const { length } = noMask
  let formattedCPF = ""

  if (length <= 3) {
    formattedCPF = noMask
  } else if (length <= 6) {
    formattedCPF = noMask.replace(/(\d{3})(\d)/, "$1.$2")
  } else if (length <= 9) {
    formattedCPF = noMask.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3")
  } else if (length === 10) {
    formattedCPF = noMask.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4")
  } else {
    formattedCPF = noMask.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  return formattedCPF.slice(0, 14)
}

export const maskPhone = (input: string) => {
  let noMask = input.replace(/\D/g, "")
  let { length } = noMask
  let formattedPhone = ""
  if (length === 13) {
    noMask = noMask.slice(2)
  }

  if (length <= 2) {
    formattedPhone = noMask
  } else if (length <= 7) {
    formattedPhone = noMask.replace(/(\d{2})(\d)/, "($1) $2")
  } else {
    formattedPhone = noMask.replace(/(\d{2})(\d{1,5})(\d{1,4})/, "($1) $2-$3")
  }

  return formattedPhone.slice(0, 15)
}
