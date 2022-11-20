import { ActionFunction, json, LoaderFunction, Session } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import CartContent from "~/components/CartContent";
import CartHeader from "~/components/CartHeader";
import CartCheckoutButton from "~/components/CheckoutButton";
import ServerError from "~/components/ServerError";
import { commitSession, getSession } from "~/sessions";
import {
  Cart,
  CartAction,
  editCart,
  handleIncomingCartSession,
} from "~/utils/cartUtils";

export type CartActionError = {
  action: CartAction;
  error: string;
};

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
    return json(await editCart(action, formData));
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ServerError />;
}

type LoaderData = Cart;

export default function CartRoute() {
  const cart = useLoaderData<LoaderData>();
  const isStoreActive = cart.checkoutUrl != null;

  return (
    <section className="p-8">
      <div className="my-4">
        <CartHeader
          subtotal={Number(cart.cost.subtotalAmount.amount)}
          totalQuantity={cart.totalQuantity}
          itemsAlign="center"
        >
          <h1 className="hidden">Cart</h1>
          <CartCheckoutButton
            checkoutUrl={cart?.checkoutUrl}
            disabled={cart?.totalQuantity <= 0 || !isStoreActive}
          />
        </CartHeader>
        <CartContent cart={cart} />
      </div>
    </section>
  );
}
