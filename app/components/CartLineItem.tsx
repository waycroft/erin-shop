import { FetcherWithComponents, useFetcher } from "@remix-run/react";
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
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.submission) {
      const formData = fetcher.submission.formData;
      if (formData.get("_action") === "updateLineItems") {
        const lineItemsFormData = formData.get("lineItems");
        invariant(lineItemsFormData, "lineItemsFormData must be defined");
        const lineItems: CartLineItemInterface = JSON.parse(
          lineItemsFormData.toString()
        );
        setQuantity(lineItems.quantity);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    setQuantity(lineItem.quantity);
  }, [lineItem]);

  return (
    <div className="card-body overflow-x-auto bg-base-200">
      <h2 className="card-title">{lineItem.merchandise?.product.title}</h2>
      <p>{quantity}</p>
      <pre>
        item.id:{" "}
        <span className="text-green-500">{lineItem.merchandise?.id}</span>
      </pre>
      <div className="card-actions justify-end">
        <ChangeQuantityButtons
          lineItemId={lineItem.id}
          quantity={quantity}
          isUpdatingQuantity={isUpdatingQuantity}
          setIsUpdatingQuantity={setIsUpdatingQuantity}
          quantityAvailable={Number(lineItem.merchandise?.quantityAvailable)}
          fetcher={fetcher}
        />
        <EditLineItemButtons
          lineItemId={lineItem.id}
          isUpdatingQuantity={isUpdatingQuantity}
          setIsUpdatingQuantity={setIsUpdatingQuantity}
          fetcher={fetcher}
        />
      </div>
    </div>
  );
}

function EditLineItemButtons({
  lineItemId,
  isUpdatingQuantity,
  setIsUpdatingQuantity,
  fetcher,
}: {
  lineItemId: string;
  isUpdatingQuantity: boolean;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
  fetcher: FetcherWithComponents<any>;
}) {
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

        <fetcher.Form method="post" action="/">
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
  isUpdatingQuantity,
  setIsUpdatingQuantity,
  quantityAvailable,
  fetcher,
}: {
  lineItemId: CartLineItemId;
  quantity: number;
  isUpdatingQuantity: boolean;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
  quantityAvailable: number;
  fetcher: FetcherWithComponents<any>;
}) {
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
      <fetcher.Form method="post" action="/">
        <input
          type="number"
          className="input input-bordered my-2"
          defaultValue={quantity}
          onInvalid={() => {
            {
              /* Don't hide the input field if the user enters an invalid value */
            }
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
            setIsUpdatingQuantity(false);
          }}
        >
          Cancel
        </button>
        {/* TODO: Might want to re-think putting everything in JSON hidden inputs,
          since it's awkward using useRef to get the value of the input field */}
        <input
          type="hidden"
          name="lineItems"
          value={JSON.stringify({
            id: lineItemId,
            quantity: Number(quantityInputFieldRef.current?.value),
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
