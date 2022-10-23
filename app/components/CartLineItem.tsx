import { FetcherWithComponents } from "@remix-run/react";
import { useState } from "react";
import { CartActionError } from "~/routes/cart";
import { ProductVariant } from "~/routes/piece/$productHandle";

export type CartLineItemInterface = {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
};

function CardImage({ imgUrl, imgTitle }: { imgUrl: string; imgTitle: string }) {
  return (
    <figure>
      <img src={imgUrl} alt={`An image of ${imgTitle}`} className="max-h-48" />
    </figure>
  );
}

function CardBody({
  lineItem,
  quantity,
  setQuantity,
  fetcher,
}: {
  lineItem: CartLineItemInterface,
  quantity: number,
  setQuantity: (quantity: number) => void;
  fetcher: FetcherWithComponents<any>;
}) {
  return (
    <div className="card-body overflow-x-auto">
      <h2 className="card-title">{lineItem.merchandise.title}</h2>
      <p>{lineItem.quantity}</p>
      <pre>
        item.id: <span className="text-green-500">{lineItem.merchandise.id}</span>
      </pre>
      <div className="card-actions justify-end">
        <fetcher.Form method="post" action="/cart">
          <LineItemActionButtons
            lineItemId={lineItem.id}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </fetcher.Form>
      </div>
    </div>
  );
}

function LineItemActionButtons({
  lineItemId,
  quantity,
  setQuantity,
}: {
  lineItemId: string;
  quantity: number;
  setQuantity: (quantity: number) => void;
}) {
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const mutationPayload = isUpdatingQuantity
    ? {
        id: lineItemId,
        quantity: quantity,
      }
    : {
        id: lineItemId,
      };
  return (
    <div>
      {/* The vanity input for changing quantity */}
      <input
        type="number"
        className="input input-bordered my-2"
        defaultValue={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        hidden={!isUpdatingQuantity}
      />
      <button
        className="btn btn-secondary m-2"
        type="button"
        onClick={() => setIsUpdatingQuantity(!isUpdatingQuantity)}
      >
        {isUpdatingQuantity ? "Cancel" : "Change quantity"}
      </button>

      {/* Hybrid button for submitting updateLineItems or removeLineItems */}
      <button
        className="btn btn-secondary m-2"
        type="submit"
        name="_action"
        value={isUpdatingQuantity ? "updateLineItems" : "removeLineItems"}
      >
        {isUpdatingQuantity ? "save" : "remove"}
      </button>

      {/* The mutation data */}
      <input
        type="hidden"
        name="lineItems"
        value={JSON.stringify(mutationPayload)}
      />
    </div>
  );
}

export default function CartLineItem({
  item,
  fetcher,
}: {
  item: CartLineItemInterface;
  fetcher: FetcherWithComponents<CartActionError>;
}) {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <div className="card card-side card-bordered bg-base-400">
      <CardImage
        imgUrl={item.merchandise.image.url}
        imgTitle={item.merchandise.title}
      />
      <CardBody
        lineItem={item}
        quantity={quantity}
        setQuantity={setQuantity}
        fetcher={fetcher}
      />
    </div>
  );
}
