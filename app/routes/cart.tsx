import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import CartContent, { Cart } from "~/components/CartContent";
import {
  addLineItemsToCart,
  getCart,
  removeLineItemsFromCart,
} from "~/utils/cartUtils";

type LoaderData = {
  data: {
    cart: Cart;
  };
};

export const loader: LoaderFunction = async () => {
  const cart = await getCart(process.env.TEST_CART as string);
  return cart;
};

// BOOKMARK: Add transitions / notification that item was removed
// Add an undo toast
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const lineItemIds = formData.getAll("lineItemId").map((id) => id.toString());
  const _action = formData.get("_action")?.toString();

  console.log("_action", _action);

  if (_action === "addLineItem") {
    const merchandiseId = formData.get("productVariantId")?.toString();
    const quantity = formData.get("quantity")?.toString();
    invariant(merchandiseId && quantity, "Missing merchandiseId or quantity");

    const addLineItemsToCartOp = await addLineItemsToCart({
      cartId: process.env.TEST_CART as string,
      lines: [
        {
          merchandiseId: merchandiseId,
          quantity: parseInt(quantity),
        },
      ],
    });
  }

  if (_action === "removeLineItem") {
    invariant(lineItemIds.length, "Missing lineItemIds");

    const removeLineItemsFromCartOp = await removeLineItemsFromCart({
      cartId: process.env.TEST_CART as string,
      lineIds: lineItemIds,
    });
  }

  return null;
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
  console.log(cartContents);

  return (
    <section className="p-8">
      <h1 className="text-6xl font-bold">Cart</h1>
      <div className="my-4">
        <CartContent cartContents={cartContents} />
      </div>
    </section>
  );
}
