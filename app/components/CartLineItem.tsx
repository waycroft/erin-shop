import { FetcherWithComponents } from "@remix-run/react";
import { useEffect } from "react";
import { CartActionError } from "~/routes/cart";
import { ProductVariant } from "~/routes/piece/$productHandle";

export type CartLineItemInterface = {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
};

export default function CartLineItem({
  item,
  fetcher,
}: {
  item: CartLineItemInterface;
  fetcher: FetcherWithComponents<CartActionError>;
}) {
  useEffect(() => {
    console.log("item changed", item);
  }, [item]);
  {
    /*TODO: Now the fetcher is CartContents-wide, which means that ALL items will disappear until cart is refreshed after action. I'll probably need to utilize useState to keep UI immediately responsive.*/
  }
  return (
    <div className="card card-side card-bordered bg-base-400">
      <figure>
        <img
          src={item.merchandise.image.url}
          alt={`An image of ${item.merchandise.product.title}`}
          className="max-h-48"
        />
      </figure>
      <div className="card-body overflow-x-auto">
        <h2 className="card-title">{item.merchandise.product.title}</h2>
        <p>{item.merchandise.product.description}</p>
        <pre>
          item.id: <span className="text-green-500">{item.id}</span>
        </pre>
        <div className="card-actions justify-end">
          <fetcher.Form method="post" action="/cart">
            <input
              type="number"
              className="input input-bordered my-2"
              defaultValue={item.quantity}
            />
            <input type="hidden" name="lineItemId" value={item.id} />
            <button
              className="btn btn-secondary"
              type="submit"
              name="_action"
              value="removeLineItems"
            >
              Remove
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
