import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import CartContent, { Cart } from "./components/CartContent";
import Footer from "./components/Footer";
import PrimaryNav from "./components/PrimaryNav";
import ServerError from "./components/ServerError";
import styles from "./styles/app.css";
import { editCart, getCart } from "./utils/cartUtils";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Erin Hoffman: Shop",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type LoaderData = {
  data: {
    cart: Cart;
  };
};

export const loader: LoaderFunction = async () => {
  try {
    const cart = await getCart(process.env.TEST_CART as string);
    return cart;
  } catch (error: any) {
    console.error(error);
    return json({ error: error.message, status: 500 });
  }
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

export default function App() {
  const { data } = useLoaderData<LoaderData>();

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
          <PrimaryNav cartQuantity={data.cart.totalQuantity} />
          <Outlet />
          <Footer />
        </div>
        <div className="drawer-side">
          <label htmlFor="cart-drawer" className="drawer-overlay"></label>
          <section className="p-4 overflow-y-auto w-80 text-base-content bg-base-100 drop-shadow-xl">
            <Link to="/cart">
              <h1 className="text-2xl font-bold">Cart</h1>
            </Link>
            <CartContent contents={data.cart} />
          </section>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
