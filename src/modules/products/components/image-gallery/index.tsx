"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return null
  }

  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="relative aspect-square w-full overflow-hidden bg-sand">
        {!!activeImage.url && (
          <Image
            src={activeImage.url}
            priority
            className="absolute inset-0 p-6"
            alt="Product image"
            fill
            sizes="(max-width: 576px) 480px, (max-width: 992px) 600px, 800px"
            style={{ objectFit: "contain" }}
          />
        )}
      </Container>

      {images.length > 1 && (
        <div className="grid grid-cols-5 small:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={clx(
                "relative aspect-square bg-sand overflow-hidden border transition-colors",
                index === activeIndex
                  ? "border-ink"
                  : "border-transparent hover:border-line"
              )}
              aria-label={`View image ${index + 1}`}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  className="absolute inset-0 p-1"
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  style={{ objectFit: "contain" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
