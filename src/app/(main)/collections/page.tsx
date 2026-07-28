import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Collections | Elzif",
  description: "Browse all product collections and categories at Elzif.",
  alternates: {
    canonical: "/collections",
  },
}

export default async function CollectionsIndexPage() {
  const [productCategories, { collections }] = await Promise.all([
    listCategories(),
    listCollections({ fields: "id, handle, title" }),
  ])

  const topLevelCategories = (productCategories || []).filter(
    (c: any) => !c.parent_category
  )

  return (
    <div className="content-container py-10">
      <h1 className="text-2xl font-semibold text-ink mb-8">Collections</h1>

      {topLevelCategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-mute mb-4">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
            {topLevelCategories.map((category: any) => (
              <div key={category.id} className="border border-line p-4">
                <LocalizedClientLink
                  href={`/collections/${category.handle}`}
                  className="text-sm font-medium text-ink hover:text-mute transition-colors"
                >
                  {category.name}
                </LocalizedClientLink>
                {category.category_children?.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-y-1">
                    {category.category_children.map((child: any) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={`/collections/${child.handle}`}
                          className="text-xs text-mute hover:text-ink transition-colors"
                        >
                          {child.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {collections && collections.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-mute mb-4">
            All collections
          </h2>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
            {collections.map((collection) => (
              <LocalizedClientLink
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="border border-line p-4 text-sm font-medium text-ink hover:text-mute transition-colors"
              >
                {collection.title}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
