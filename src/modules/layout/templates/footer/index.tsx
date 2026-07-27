import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterForm from "@modules/layout/components/newsletter-form"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  const topLevelCategories = (productCategories || []).filter(
    (c: any) => !c.parent_category
  )

  return (
    <footer className="border-t border-line w-full bg-sand">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10 py-16">
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="font-semibold text-xl tracking-tight text-ink"
            >
              Elzif
            </LocalizedClientLink>
            <p className="text-sm text-mute max-w-xs leading-relaxed">
              Skincare and beauty essentials, curated for everyday routines.
            </p>
          </div>

          {topLevelCategories.length > 0 && (
            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-ink">
                Shop
              </span>
              <ul className="flex flex-col gap-y-2" data-testid="footer-categories">
                {topLevelCategories.slice(0, 6).map((c: any) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-sm text-mute hover:text-ink transition-colors"
                      href={`/collections/${c.handle}`}
                      data-testid="category-link"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {collections && collections.length > 0 && (
            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-ink">
                Collections
              </span>
              <ul className="flex flex-col gap-y-2">
                {collections?.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-sm text-mute hover:text-ink transition-colors"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink">
              Stay in touch
            </span>
            <p className="text-sm text-mute">
              Sign up for restocks, new arrivals and offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col-reverse small:flex-row gap-y-4 w-full py-6 border-t border-line justify-between items-center">
          <Text className="text-xs text-mute">
            © {new Date().getFullYear()} Elzif. All rights reserved.
          </Text>
          <div className="flex items-center gap-x-6">
            <LocalizedClientLink
              href="/store"
              className="text-xs uppercase tracking-widest text-mute hover:text-ink transition-colors"
            >
              All products
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
