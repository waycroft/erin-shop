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

export default function CartContent({ cartContents }: { cartContents: Cart }) {
  /* BOOKMARK: Cart is rendering! Now I need to figure out how to query the Product
          title from the ProductVariant title (which is currently "Default Title") */
  return (
    <div>
      <ol className="list-decimal">
        {cartContents?.lines?.edges?.map((edge) => (
          <li key={edge.node.id}>
            <div className="flex flex-col justify-start w-100">
              <p>{edge.node.id}</p>
              <h2>{edge.node.merchandise.title}</h2>
              <p>{edge.node.quantity}</p>
            </div>
            {/* <CartLineItem /> */}
          </li>
        )) ?? <p>Cart could't be fetched...</p>}
      </ol>
    </div>
  );
}
