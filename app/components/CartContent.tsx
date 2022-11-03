import { useState } from "react";
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
  const [cartContents, setCartContents] = useState(cart.lines.edges);

  return (
    <div>
      <div>
        <ol>
          {cartContents.map((edge) => (
            // BOOKMARK: optimistic UI for removing a cart item
            <li key={edge.node.id} className="py-2">
              <CartLineItem
                key={edge.node.id}
                item={edge.node}
                setCart={setCartContents}
              />
            </li>
          )) ?? <p>Cart could't be displayed...</p>}
        </ol>
      </div>
      <div>
        <p>Subtotal: {cart?.cost?.subtotalAmount?.amount}</p>
        <p>Total Quantity: {cart?.totalQuantity}</p>
      </div>
    </div>
  );
}
