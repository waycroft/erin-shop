import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import CartContent, { Cart } from "~/components/CartContent";
import { CartAction, editCart, getCart } from "~/utils/cartUtils";

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

// BOOKMARK: Add an undo toast (good feedback that an item was removed)
// TODO: good opportunity to also use Framer motion to animate items being removed
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
    try {
      return json(await editCart(action, formData));
    } catch (error){
      throw new Error("Cart action failed");
    }
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.message}</p>
      <p>Stack:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function CartRoute() {
  const { data } = useLoaderData<LoaderData>();
  const cartContents = data?.cart;

  return (
    <section className="p-8">
      <h1 className="text-6xl font-bold">Cart</h1>
      <div className="my-4">
        <CartContent contents={cartContents} />
      </div>
      <a href={cartContents?.checkoutUrl} className="btn btn-primary">
        Checkout
      </a>
    </section>
  );
}
