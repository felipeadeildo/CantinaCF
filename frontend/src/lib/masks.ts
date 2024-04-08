export const maskMoney = (money: string) => {
  const cleanedMoney = money.replace(/\D/g, "")

  if (cleanedMoney === "") {
    return ""
  }

  const integerPart = parseInt(cleanedMoney.slice(0, -2) || "0").toString()
  const decimalPart = cleanedMoney.slice(-2)

  // Insert dot every three digits from the end of integer part
  const formattedInteger = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")

  const formattedMoney = formattedInteger + "," + decimalPart

  return formattedMoney
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
