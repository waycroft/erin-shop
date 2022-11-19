import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import CartContent from "~/components/CartContent";
import CartCheckoutButton from "~/components/CheckoutButton";
import ServerError from "~/components/ServerError";
import { Cart, CartAction, editCart, getCart } from "~/utils/cartUtils";

type LoaderData = {
  data: {
    cart: Cart;
  };
};

export type CartActionError = {
  action: CartAction;
  error: string;
};

export const loader: LoaderFunction = async () => {
  const cart = await getCart(process.env.TEST_CART as string);
  return cart;
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
    return json(await editCart(action, formData));
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ServerError />;
}

export default function CartRoute() {
  const { data } = useLoaderData<LoaderData>();
  const cart = data?.cart;

  return (
    <section className="p-8">
      <h1 className="text-6xl font-bold">Cart</h1>
      <div className="my-4">
        <CartContent cart={cart} />
      </div>
      <CartCheckoutButton
        checkoutUrl={cart?.checkoutUrl}
        disabled={cart?.totalQuantity <= 0}
      />
    </section>
  );
}
