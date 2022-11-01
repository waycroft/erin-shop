import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { CartLineItemId, CartLineItemInterface } from "~/utils/cartUtils";

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

  // BOOKMARK: Can't find a happy balance between using the lineItem's
  // quantity and the quantity in the state...
  console.log("cardbody re-rendered");
  console.log("lineItem.quantity", lineItem.quantity);

  return (
    <div className="card-body overflow-x-auto bg-base-200">
      <h2 className="card-title">{lineItem.merchandise?.product.title}</h2>
      {/* <p>{quantity}</p> */}
      <p>{lineItem.quantity}</p>
      <pre>
        item.id:{" "}
        <span className="text-green-500">{lineItem.merchandise?.id}</span>
      </pre>
      <div className="card-actions justify-end">
        <ChangeQuantityButtons
          lineItemId={lineItem.id}
          quantity={quantity}
          setQuantity={setQuantity}
          isUpdatingQuantity={isUpdatingQuantity}
          setIsUpdatingQuantity={setIsUpdatingQuantity}
          quantityAvailable={Number(lineItem.merchandise?.quantityAvailable)}
        />
        <EditLineItemButtons
          lineItemId={lineItem.id}
          isUpdatingQuantity={isUpdatingQuantity}
          setIsUpdatingQuantity={setIsUpdatingQuantity}
        />
      </div>
    </div>
  );
}

function EditLineItemButtons({
  lineItemId,
  isUpdatingQuantity,
  setIsUpdatingQuantity,
}: {
  lineItemId: string;
  isUpdatingQuantity: boolean;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
}) {
  const fetcher = useFetcher();

  return (
    <div>
      <div className={isUpdatingQuantity ? "hidden" : ""}>
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
          <input type="hidden" name="lineItemIds" value={lineItemId} />
        </fetcher.Form>
      </div>
    </div>
  );
}

function ChangeQuantityButtons({
  lineItemId,
  quantity,
  setQuantity,
  isUpdatingQuantity,
  setIsUpdatingQuantity,
  quantityAvailable,
}: {
  lineItemId: CartLineItemId;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isUpdatingQuantity: boolean;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
  quantityAvailable: number;
}) {
  const fetcher = useFetcher();
  const initQuantity = useRef<number>(quantity).current;
  const quantityInputFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUpdatingQuantity) {
      invariant(
        quantityInputFieldRef.current,
        "quantityInputFieldRef.current must not be null in order to focus"
      );
      quantityInputFieldRef.current.focus();
    }
  }, [isUpdatingQuantity]);

  return (
    <div className={isUpdatingQuantity ? "" : "hidden"}>
      <fetcher.Form method="post" action="/cart">
        <input
          type="number"
          className="input input-bordered my-2"
          defaultValue={initQuantity}
          onChange={(e) => {
            setQuantity(Number(e.target.value));
          }}
          onInvalid={(e) => {
            setIsUpdatingQuantity(true);
          }}
          min={0}
          max={quantityAvailable}
          ref={quantityInputFieldRef}
        />
        <button
          className="btn btn-secondary m-2"
          type="submit"
          name="_action"
          value={"updateLineItems"}
          onClick={() => {
            setIsUpdatingQuantity(false);
          }}
        >
          Save
        </button>
        <button
          className="btn btn-secondary m-2"
          type="reset"
          onClick={() => {
            setQuantity(initQuantity);
            setIsUpdatingQuantity(false);
          }}
        >
          Cancel
        </button>
        <input
          type="hidden"
          name="lineItems"
          value={JSON.stringify({
            id: lineItemId,
            quantity: quantity,
          })}
        />
      </fetcher.Form>
    </div>
  );
}

export default function CartLineItem({
  item,
}: {
  item: CartLineItemInterface;
}) {
  return (
    <div className="card card-side card-bordered bg-base-400">
      <CardImage
        imgUrl={item.merchandise?.image.url ?? ""}
        imgTitle={item.merchandise?.title ?? ""}
      />
      <CardBody lineItem={item} />
    </div>
  );
}
