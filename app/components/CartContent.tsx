import { useFetcher } from "@remix-run/react";
import { Cart } from "~/utils/cartUtils";
import CartLineItem from "./CartLineItem";

export default function CartContent({ cart }: { cart: Cart }) {
  const fetcher = useFetcher();
  const cartHasItems = cart.totalQuantity > 0;
  // TODO: should be using state to manage cart line items (better for reactive, optimistic UI and eventually being able to undo)

  return (
    <>
      <div className="h-full">
        {cartHasItems ? (
          <ol className="divide-y container mx-auto">
            {cart.lines.edges.map((edge) => (
              <li key={edge.node.id} className="py-4">
                <CartLineItem
                  key={edge.node.id}
                  item={edge.node}
                  fetcher={fetcher}
                />
              </li>
            ))}
          </ol>
        ) : (
          <div className="container mx-auto h-full flex flex-col place-content-center text-center">
            <p>Your cart is empty</p>
          </div>
        )}
      </div>
    </>
  );
}
