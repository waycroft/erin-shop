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

export default function CartContent({ cartContents }: { cartContents: Cart }) {
  return (
    <div>
      <ol className="list-decimal">
        {cartContents?.lines?.edges.map((edge) => (
          <li>
            <div key={edge.node.id}>
              {/* BOOKMARK: Cart is rendering! Now I need to figure out how to query the Product
          title from the ProductVariant title (which is currently "Default Title") */}
              <p>{edge.node.id}</p>
              <h2>{edge.node.merchandise.title}</h2>
              <p>{edge.node.quantity}</p>
            </div>
          </li>
        )) ?? <p>Cart could't be fetched...</p>}
      </ol>
    </div>
  );
}
