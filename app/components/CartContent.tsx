import { useFetcher } from "@remix-run/react";
import type { CartLineItemInterface } from "~/utils/cartUtils";
import CartLineItem from "./CartLineItem";

export type Cart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: {
      amount: string;
    };
  };
  totalQuantity: number;
  updatedAt: string;
  createdAt: string;
  lines: {
    edges: {
      node: CartLineItemInterface;
    }[];
  };
};

export default function CartContent({ cart }: { cart: Cart }) {
  const fetcher = useFetcher();

  return (
    <>
      <div>
        <ol>
          {cart.lines.edges
            .filter((edge) => {
              const lineItem = edge.node.id;
              if (
                fetcher.submission?.formData.get("_action") ===
                "removeLineItems"
              ) {
                const lineItemIdsToRemove = fetcher.submission?.formData
                  .getAll("lineItemId")
                  .map((lineItemId) => lineItemId.toString());
                return !lineItemIdsToRemove?.includes(lineItem);
              } else {
                return true;
              }
            })
            .map((edge) => (
              // BOOKMARK: optimistic UI for removing a cart item
              <li key={edge.node.id} className="py-2">
                <CartLineItem
                  key={edge.node.id}
                  item={edge.node}
                  fetcher={fetcher}
                />
              </li>
            ))}
        </ol>
      </div>
      <div>
        <p>Subtotal: {cart?.cost?.subtotalAmount?.amount}</p>
        <p>Total Quantity: {cart?.totalQuantity}</p>
      </div>
    </>
  );
}
