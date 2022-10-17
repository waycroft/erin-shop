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
      {cartContents?.lines?.edges.map((edge) => (
        <div key={edge.node.id}>
          <h2>{edge.node.merchandise.title}</h2>
          <p>{edge.node.quantity}</p>
        </div>
      ))}
    </div>
  );
}
