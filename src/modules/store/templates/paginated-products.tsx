import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { applyManualSort } from "@lib/util/manual-sort"
import InfiniteProductGrid from "@modules/store/components/infinite-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  collectionId,
  categoryId,
  productsIds,
  query,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  query?: string
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 500,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (query) {
    queryParams["q"] = query
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products },
  } = await listProductsWithSort({
    page: 1,
    queryParams,
    sortBy,
    countryCode,
  })

  const sortedProducts =
    !sortBy || sortBy === "created_at" ? applyManualSort(products) : products

  return <InfiniteProductGrid products={sortedProducts} region={region} />
}
