import { useFetcher } from "@remix-run/react";
import type { CartLineItem } from "./CartLineItem";

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
      node: CartLineItem;
    }[];
  };
};

export default function CartContent({ contents }: { contents: Cart }) {
  const fetcher = useFetcher();

  return (
    <div>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
      <h2>Subtotal</h2>
      {/* {cart.cost} */}
      $420.00
    </div>
  );
}
