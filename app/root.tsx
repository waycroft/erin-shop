import type { MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
} from "@remix-run/react";
import { useEffect } from "react";
import CartContent from "./components/CartContent";
import Footer from "./components/Footer";
import PrimaryNav from "./components/PrimaryNav";
import styles from "./styles/app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Erin Hoffman: Shop",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/cart");
    }
    // if (fetcher.type === "done") {
    //   console.log(fetcher.data);
    // }
  }, [fetcher]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="drawer drawer-end">
        <input id="cart-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* All page content goes within "drawer-content". 
          Since the cart will be accessible on all pages, it's included here in the root. */}
          <PrimaryNav />
          <Outlet />
          <Footer />
        </div>
        <div className="drawer-side">
          <label htmlFor="cart-drawer" className="drawer-overlay"></label>
          <section className="p-4 overflow-y-auto w-80 text-base-content bg-base-100 drop-shadow-xl">
            <Link to="/cart">
              <h1 className="text-2xl font-bold">Cart</h1>
            </Link>
            <CartContent cartContents={fetcher.data?.data?.cart} />
          </section>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
