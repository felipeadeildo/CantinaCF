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
