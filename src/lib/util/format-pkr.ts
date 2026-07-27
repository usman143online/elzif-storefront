/**
 * Formats a numeric amount in the Shopify-style Pakistani Rupee format
 * used across the storefront, e.g. "Rs.699 PKR".
 */
export const formatPKR = (amount: number) => {
  const rounded = Math.round(amount)
  return `Rs.${rounded.toLocaleString("en-PK")} PKR`
}
