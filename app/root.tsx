import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  Session,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import CartContent from "./components/CartContent";
import CartHeader from "./components/CartHeader";
import CartCheckoutButton from "./components/CheckoutButton";
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";
import PrimaryNav from "./components/PrimaryNav";
import ServerError from "./components/ServerError";
import { commitSession, getSession } from "./sessions";
import styles from "./styles/app.css";
import { CartIdContext } from "./utils/cartContext";
import { Cart, editCart, handleIncomingCartSession } from "./utils/cartUtils";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Erin Hoffman: Shop",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: "https://use.typekit.net/urj5czf.css" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700&display=swap",
    },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const session: Session = await getSession(request.headers.get("Cookie"));
  let cart: Cart = await handleIncomingCartSession(session);
  return json(cart, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");
  invariant(_action, "No action was provided");
  const action = _action.toString();
  const isCartAction =
    action === "addLineItems" ||
    action === "updateLineItems" ||
    action === "removeLineItems";

  if (isCartAction) {
    return await editCart(action, formData);
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ServerError />;
}

type LoaderData = Cart;

export default function App() {
  const cart = useLoaderData<LoaderData>();
  const isStoreActive = cart.checkoutUrl != null;
  const matches = useMatches();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <CartIdContext.Provider value={cart.id}>
        <body className="drawer drawer-end font-body">
          <input id="cart-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* All page content goes within "drawer-content".
            Since the cart will be accessible on all pages, it's included here in the root. */}
            <PrimaryNav cartQuantity={cart.totalQuantity} />
            <Outlet />
            <Footer />
          </div>
          <Drawer cart={cart} isStoreActive={isStoreActive} />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </CartIdContext.Provider>
    </html>
  );
}
