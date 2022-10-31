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

export default function CartContent({ contents }: { contents: Cart }) {
  return (
    <div>
      <div>
        <ol>
          {contents?.lines?.edges?.map((edge) => (
            <li key={edge.node.id} className="py-2">
              <CartLineItem item={edge.node} />
            </li>
          )) ?? <p>Cart could't be displayed...</p>}
        </ol>
      </div>
      <div>
        <p>Subtotal: {contents?.cost?.subtotalAmount?.amount}</p>
        <p>Total Quantity: {contents?.totalQuantity}</p>
      </div>
    </div>
  );
}
