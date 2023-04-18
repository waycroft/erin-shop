import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  Session,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import { useState } from "react"
import invariant from "tiny-invariant"
import Footer from "./components/Footer"
import HomeBanner from "./components/HomeBanner"
import MobileNavSheet from "./components/MobileNavSheet"
import PrimaryNav from "./components/PrimaryNav"
import ServerError from "./components/ServerError"
import { commitSession, getSession } from "./sessions"
import styles from "./styles/app.css"
import { CartIdContext } from "./utils/cartContext"
import { Cart, editCart, handleIncomingCartSession } from "./utils/cartUtils"

export const meta: MetaFunction = () => {
  const description = "Original art by Erin Hoffman"
  const title = "Erin Hoffman: Collect"
  const url = "https://collect.erinhoffman.com"
  const img =
    "https://erinhoffman.sfo3.digitaloceanspaces.com/opengraph_img.png"
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: title,
    "og:title": title,
    "og:url": url,
    "og:type": "website",
    "og:image": img,
    description: description,
    "og:description": description,
    content: description,
    "twitter:card": "summary_large_image",
  }
}

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://use.typekit.net/urj5czf.css",
      defer: true,
    },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700&display=swap",
      defer: true,
    },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const session: Session = await getSession(request.headers.get("Cookie"))
  let cart: Cart = await handleIncomingCartSession(session)
  return json(cart, {
    headers: { "Set-Cookie": await commitSession(session) },
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const _action = formData.get("_action")
  invariant(_action, "No action was provided")
  const action = _action.toString()
  const isCartAction =
    action === "addLineItems" ||
    action === "updateLineItems" ||
    action === "removeLineItems"

  if (isCartAction) {
    return await editCart(action, formData)
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return <ServerError />
}

type LoaderData = Cart

export default function App() {
  const cart = useLoaderData<LoaderData>()
  const isStoreActive = !!cart?.checkoutUrl
  const [isBannerVisible, setIsBannerVisible] = useState(!isStoreActive)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <CartIdContext.Provider value={cart.id}>
        <body className="font-body">
          <HomeBanner
            isBannerVisible={isBannerVisible}
            setIsBannerVisible={setIsBannerVisible}
          />
          <PrimaryNav
            cartQuantity={cart.totalQuantity}
            setIsMobileNavOpen={setIsMobileNavOpen}
          />
          {isMobileNavOpen ? (
            <MobileNavSheet setIsMobileNavOpen={setIsMobileNavOpen} />
          ) : null}
          {/* <Outlet /> */}
          <div className="text-center p-4 flex flex-col gap-2">
            <p>
              <strong>collect.erinhoffman.com is closed (for now)</strong>
            </p>
            <p>
              In the meantime, you can visit my main artist website at{" "}
              <a href="https://erinphoffman.com" className="underline">
                erinphoffman.com
              </a>
            </p>
          </div>
          <Footer />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </CartIdContext.Provider>
    </html>
  )
}
