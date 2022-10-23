import { useFetcher } from "@remix-run/react";
import { CartActionError } from "~/routes/cart";
import type { CartLineItemInterface } from "./CartLineItem";
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
  const fetcher = useFetcher();
  const cartActionError: CartActionError = fetcher.data;
  const removeFromCartFailed = cartActionError?.action === "removeLineItems";

  return (
    <div>
      <div>
        <ol>
          {contents?.lines?.edges?.map((edge) => (
            <li key={edge.node.id} className="py-2">
              <CartLineItem item={edge.node} fetcher={fetcher} />
            </li>
          )) ?? <p>Cart could't be fetched...</p>}
        </ol>
      </div>
      <div>
        <p>Subtotal: {contents?.cost?.subtotalAmount?.amount}</p>
        <p>Total Quantity: {contents?.totalQuantity}</p>
      </div>
    </div>
  );
}
