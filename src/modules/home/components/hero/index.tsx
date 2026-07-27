import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCollections } from "@lib/data/collections"

const Hero = async () => {
  const { collections } = await listCollections({ fields: "id, handle, title" })
  const firstCollection = collections?.[0]

  return (
    <div className="w-full bg-sand border-b border-line">
      <div className="content-container flex flex-col items-center text-center py-24 small:py-36 gap-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">
          New season, new routine
        </span>
        <h1 className="text-4xl small:text-6xl font-semibold tracking-tight text-ink max-w-3xl leading-[1.05]">
          Skincare that earns a place on your shelf
        </h1>
        <p className="text-base small:text-lg text-mute max-w-xl">
          Trusted formulas for cleansing, hydration and everyday glow —
          sourced from brands people already reach for.
        </p>
        <div className="flex items-center gap-x-4 mt-4">
          <LocalizedClientLink
            href="/store"
            className="bg-ink text-paper text-xs font-medium uppercase tracking-widest px-8 py-3.5 hover:bg-ink/85 transition-colors"
          >
            Shop all products
          </LocalizedClientLink>
          {firstCollection && (
            <LocalizedClientLink
              href={`/collections/${firstCollection.handle}`}
              className="border border-ink text-ink text-xs font-medium uppercase tracking-widest px-8 py-3.5 hover:bg-ink hover:text-paper transition-colors"
            >
              {firstCollection.title}
            </LocalizedClientLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero
