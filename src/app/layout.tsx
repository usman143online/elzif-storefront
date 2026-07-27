import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Assistant } from "next/font/google"
import "styles/globals.css"

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={assistant.variable}>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
