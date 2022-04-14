/**
 *
 * @param {number} amount the amount to format
 * @param {string} currencyCode the currency code to use for the price
 * @param {number} taxRate the tax rate to apply to the price
 * @param {number} quantity is optional and defaults to 1
 * @returns {string} the formatted price
 */
export const formatPrice = (
  amount: number,
  currencyCode: string,
  quantity = 1,
  taxRate = 0
): string => {
  return (
    parseFloat(((amount / 100) * quantity * 1).toFixed(2)) +
    " " +
    currencyCode.toUpperCase()
  )
}
