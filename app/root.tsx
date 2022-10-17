import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
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
          <section className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
            <h1 className="text-xl font-bold">Cart</h1>
            <CartContent />
          </section>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
