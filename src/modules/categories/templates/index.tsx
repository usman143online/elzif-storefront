import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="content-container py-10" data-testid="category-container">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-ink" data-testid="category-page-title">
          {parents.map((parent) => (
            <span key={parent.id} className="text-mute font-normal">
              <LocalizedClientLink
                className="hover:text-ink"
                href={`/collections/${parent.handle}`}
                data-testid="sort-by-link"
              >
                {parent.name}
              </LocalizedClientLink>
              {" / "}
            </span>
          ))}
          {category.name}
        </h1>
        <RefinementList sortBy={sort} data-testid="sort-by-container" />
      </div>
      {category.description && (
        <p className="mb-6 text-sm text-mute max-w-2xl">{category.description}</p>
      )}
      {category.category_children && category.category_children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {category.category_children?.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/collections/${c.handle}`}
              className="text-xs uppercase tracking-widest border border-line px-4 py-2 text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              {c.name}
            </LocalizedClientLink>
          ))}
        </div>
      )}
      <Suspense
        fallback={
          <SkeletonProductGrid
            numberOfProducts={category.products?.length ?? 8}
          />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          countryCode={countryCode}
        />
      </Suspense>
    </div>
  )
}
