import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { ProductVariant } from "~/routes/piece/$productHandle";
import XErrorIcon from "./icons/XErrorIcon";

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
  const fetcher = useFetcher();
  const removeFromCartFailed = fetcher.data?.error;

  return fetcher.type === "actionSubmission" ||
    fetcher.type === "actionReload" ? null : (
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
          <input
            type="number"
            className="input input-bordered"
            defaultValue={item.quantity}
          />
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="lineItemId" value={item.id} />
            <button
              className="btn btn-secondary"
              type="submit"
              name="_action"
              value="removeLineItem"
            >
              Remove
            </button>
          </fetcher.Form>
          {fetcher.type === "done" && !!removeFromCartFailed ? (
            <div className="alert alert-error w-full flex flex-row justify-start shadow-md">
              <XErrorIcon />
              <span>Remove from cart failed. Try again?</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
