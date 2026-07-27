import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import InfiniteProductGrid from "@modules/store/components/infinite-product-grid"

export default async function NewArrivals({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 500,
      order: "-created_at",
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-mute">
          Just landed
        </span>
        <h2 className="text-2xl font-semibold text-ink mt-1">New arrivals</h2>
      </div>
      <InfiniteProductGrid products={products} region={region} />
    </div>
  )
}
