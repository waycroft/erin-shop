import { useFetcher } from "@remix-run/react";
import { Cart } from "~/utils/cartUtils";
import CartLineItem from "./CartLineItem";

export default function CartContent({ cart }: { cart: Cart }) {
  const fetcher = useFetcher();
  // TODO: should be using state to manage cart line items (better for reactive, optimistic UI and eventually being able to undo)

  return (
    <>
      <div>
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
      </div>
    </>
  );
}
