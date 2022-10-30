import { FetcherWithComponents } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { CartActionError } from "~/routes/cart";
import { ProductVariant } from "~/routes/piece/$productHandle";

export type CartLineItemInterface = {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
};

function CardImage({ imgUrl, imgTitle }: { imgUrl: string; imgTitle: string }) {
  return (
    <figure className="bg-base-200 p-4">
      <img
        src={imgUrl}
        alt={`An image of ${imgTitle}`}
        className="max-h-48 rounded-lg"
      />
    </figure>
  );
}

function CardBody({
  lineItem,
  quantity,
  setQuantity,
  fetcher,
}: {
  lineItem: CartLineItemInterface;
  quantity: number;
  setQuantity: (quantity: number) => void;
  fetcher: FetcherWithComponents<any>;
}) {
  return (
    <div className="card-body overflow-x-auto bg-base-200">
      <h2 className="card-title">{lineItem.merchandise.product.title}</h2>
      <p>{lineItem.quantity}</p>
      <pre>
        item.id:{" "}
        <span className="text-green-500">{lineItem.merchandise.id}</span>
      </pre>
      <div className="card-actions justify-end">
        <fetcher.Form method="post" action="/cart">
          <LineItemActionButtons
            lineItemId={lineItem.id}
            quantity={quantity}
            setQuantity={setQuantity}
            fetcher={fetcher}
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
  fetcher,
}: {
  lineItemId: string;
  quantity: number;
  setQuantity: (quantity: number) => void;
  fetcher: FetcherWithComponents<any>;
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

  useEffect(() => {
    console.log("isUpdatingQuantity", isUpdatingQuantity);
  }, [isUpdatingQuantity]);

  useEffect(() => {
    console.log("quantity", quantity);
  }, [quantity]);

  return (
    <div>
      <ChangeQuantityButtons
        setIsUpdatingQuantity={setIsUpdatingQuantity}
        quantity={quantity}
        setQuantity={setQuantity}
        hidden={!isUpdatingQuantity}
      />

      <div className={isUpdatingQuantity ? "hidden" : ""}>
        <button
          className="btn btn-secondary m-2"
          type="button"
          onClick={() => setIsUpdatingQuantity(!isUpdatingQuantity)}
        >
          Change quantity
        </button>
        <button
          className="btn btn-error m-2"
          type="submit"
          name="_action"
          value={"removeLineItems"}
        >
          Remove
        </button>
      </div>

      {/* The mutation data */}
      <input
        type="hidden"
        name="lineItems"
        value={JSON.stringify(mutationPayload)}
      />
    </div>
  );
}

function ChangeQuantityButtons({
  quantity,
  setQuantity,
  setIsUpdatingQuantity,
  hidden,
}: {
  quantity: number;
  setQuantity: (quantity: number) => void;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
  hidden: boolean;
}) {
  function handleChangeQuantity(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
  }

  return (
    <div className={hidden ? "hidden" : ""}>
      {/* The vanity input for changing quantity */}
      <input
        type="number"
        className="input input-bordered my-2"
        defaultValue={quantity}
        onChange={handleChangeQuantity}
      />
      <button
        className="btn btn-secondary m-2"
        type="submit"
        name="_action"
        value={"updateLineItems"}
        onClick={() => setIsUpdatingQuantity(false)}
      >
        Save
      </button>
      <button
        className="btn btn-secondary m-2"
        type="button"
        onClick={() => setIsUpdatingQuantity(false)}
      >
        Cancel
      </button>
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
