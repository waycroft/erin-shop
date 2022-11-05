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
          {cart.lines.edges.map((edge) => (
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
