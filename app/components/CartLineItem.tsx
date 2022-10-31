import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { CartActionError } from "~/routes/cart";
import { CartLineItemInterface } from "~/utils/cartUtils";

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

function CardBody({ lineItem }: { lineItem: CartLineItemInterface }) {
  const [quantity, setQuantity] = useState(lineItem.quantity);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  return (
    <div className="card-body overflow-x-auto bg-base-200">
      <h2 className="card-title">{lineItem.merchandise.product.title}</h2>
      <p>{lineItem.quantity}</p>
      <pre>
        item.id:{" "}
        <span className="text-green-500">{lineItem.merchandise.id}</span>
      </pre>
      <div className="card-actions justify-end">
        <ChangeQuantityButtons
          lineItemId={lineItem.id}
          quantity={quantity}
          setQuantity={setQuantity}
          isUpdatingQuantity={isUpdatingQuantity}
          setIsUpdatingQuantity={setIsUpdatingQuantity}
          hidden={!isUpdatingQuantity}
        />
        <EditLineItemButtons
          lineItemId={lineItem.id}
          quantity={quantity}
          setQuantity={setQuantity}
          setIsUpdatingQuantity={setIsUpdatingQuantity}
          hidden={isUpdatingQuantity}
        />
      </div>
    </div>
  );
}

function EditLineItemButtons({
  lineItemId,
  quantity,
  setQuantity,
  isUpdatingQuantity,
  setIsUpdatingQuantity,
  hidden,
}: {
  lineItemId: string;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isUpdatingQuantity: boolean;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
  hidden: boolean;
}) {
  const fetcher = useFetcher();

  return (
    <div>
      <div className={hidden ? "hidden" : ""}>
        <button
          className="btn btn-secondary m-2"
          type="button"
          onClick={() => setIsUpdatingQuantity(!isUpdatingQuantity)}
        >
          Change quantity
        </button>

        <fetcher.Form method="post" action="/cart">
          <button
            className="btn btn-error m-2"
            type="submit"
            name="_action"
            value={"removeLineItems"}
          >
            Remove
          </button>
          <input
            type="hidden"
            name="lineItemIds"
            value={lineItemId}
          />
        </fetcher.Form>
      </div>
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
  return (
    <div className={hidden ? "hidden" : ""}>
      <input
        type="number"
        className="input input-bordered my-2"
        defaultValue={quantity}
      />
      <button
        className="btn btn-secondary m-2"
        type="submit"
        name="_action"
        value={"updateLineItems"}
        onClick={() => {
          setQuantity(Number(quantity));
          setIsUpdatingQuantity(false);
        }}
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
      <CardBody lineItem={item} />
    </div>
  );
}
