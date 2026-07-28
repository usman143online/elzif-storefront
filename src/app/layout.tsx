import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
// font disabled for sandbox test
import "styles/globals.css"

const assistant = { variable: "" }; const _unused = (0, function(){})({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Elzif | Skincare & Beauty Essentials",
    template: "%s | Elzif",
  },
  description:
    "Shop trusted skincare and beauty essentials at Elzif — cleansers, serums, and everyday routines from brands people already reach for.",
  openGraph: {
    type: "website",
    siteName: "Elzif",
    title: "Elzif | Skincare & Beauty Essentials",
    description:
      "Shop trusted skincare and beauty essentials at Elzif — cleansers, serums, and everyday routines from brands people already reach for.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elzif | Skincare & Beauty Essentials",
    description:
      "Shop trusted skincare and beauty essentials at Elzif.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Elzif",
  url: getBaseURL(),
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Elzif",
  url: getBaseURL(),
  potentialAction: {
    "@type": "SearchAction",
    target: `${getBaseURL()}/store?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={assistant.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
