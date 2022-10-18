import { ProductVariant } from "~/routes/piece/$productHandle";

export type CartLineItemInterface = {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
};

export default function CartLineItem({
  item,
}: {
  item: CartLineItemInterface;
}) {
  return (
    <div className="card card-side card-bordered bg-base-400">
      <figure>
        <img
          src={item.merchandise.image.url}
          alt={`An image of ${item.merchandise.product.title}`}
          className="max-h-48"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.merchandise.product.title}</h2>
        <p>{item.merchandise.product.description}</p>
        <div className="card-actions justify-end">
          <input
            type="number"
            className="input input-bordered"
            defaultValue={item.quantity}
          />
          <button className="btn btn-primary">Remove</button>
        </div>
      </div>
    </div>
  );
}
