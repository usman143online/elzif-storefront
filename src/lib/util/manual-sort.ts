import { HttpTypes } from "@medusajs/types"

/**
 * Applies manual sort order to a list of products using each product's
 * `metadata.sort_order` value (set from the Medusa Admin's Metadata
 * section on a product). Products with a sort_order are shown first, in
 * ascending order. Products without one keep their existing relative
 * order and are shown after.
 */
export const applyManualSort = <T extends HttpTypes.StoreProduct>(
  products: T[]
): T[] => {
  const withOrder: { product: T; order: number; index: number }[] = []
  const withoutOrder: T[] = []

  products.forEach((product, index) => {
    const raw = product.metadata?.sort_order
    const order = raw !== undefined && raw !== null ? Number(raw) : NaN

    if (!Number.isNaN(order)) {
      withOrder.push({ product, order, index })
    } else {
      withoutOrder.push(product)
    }
  })

  withOrder.sort((a, b) => a.order - b.order || a.index - b.index)

  return [...withOrder.map((p) => p.product), ...withoutOrder]
}
