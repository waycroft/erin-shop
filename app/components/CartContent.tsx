import { useFetcher } from "@remix-run/react";
import { CartActionError } from "~/routes/cart";
import type { CartLineItemInterface } from "./CartLineItem";
import CartLineItem from "./CartLineItem";
import XErrorIcon from "./icons/XErrorIcon";

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
      {fetcher.type === "done" && removeFromCartFailed ? (
        <div className="toast toast-bottom toast-center">
          <div className="alert alert-error w-full flex flex-row justify-start shadow-md">
            <XErrorIcon />
            <span>Remove from cart failed. Try again?</span>
          </div>
        </div>
      ) : fetcher.type === "done" && !removeFromCartFailed ? (
        <div className="toast toast-bottom">
          <div className="alert alert-success w-full flex flex-row justify-start shadow-md">
            <button>Item removed. <span className="font-bold underline">Undo?</span></button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
