import { FetcherWithComponents, Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { CartIdContext } from "~/utils/cartContext";
import { CartLineItemId, CartLineItemInterface } from "~/utils/cartUtils";
import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";

function CardImage({
  imgUrl,
  imgTitle,
  productHandle,
}: {
  imgUrl: string;
  imgTitle: string;
  productHandle: string | undefined;
}) {
  const productSlug = productHandle ? `/piece/${productHandle}` : "#";

  return (
    <figure className="bg-base-100 sm:py-4">
      <Link to={productSlug}>
        <img
          src={imgUrl}
          alt={`An image of ${imgTitle}`}
          className="w-24 h-24 sm:w-36 sm:h-36 object-cover rounded-lg border-2 border-neutral"
        />
      </Link>
    </figure>
  );
}

function CardBody({
  lineItem,
  fetcher,
  handleRemoveLineItem,
}: {
  lineItem: CartLineItemInterface;
  fetcher: FetcherWithComponents<any>;
  handleRemoveLineItem: () => void;
}) {
  //TODO: replace these with a reducer
  const [quantity, setQuantity] = useState(lineItem.quantity);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  //TODO: think about alternative patterns over using useEffect
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
    <div className="card-body overflow-x-auto bg-base-100 justify-between !px-0 !pb-0 sm:ml-4">
      <div>
        <h2 className="font-bold text-lg">
          {lineItem.merchandise?.product.title}
        </h2>
        <p>Quantity: {lineItem.quantity}</p>
      </div>
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
          handleRemoveLineItem={handleRemoveLineItem}
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
  handleRemoveLineItem,
  fetcher,
}: {
  lineItemId: string;
  isUpdatingQuantity: boolean;
  setIsUpdatingQuantity: (isUpdatingQuantity: boolean) => void;
  handleRemoveLineItem: () => void;
  fetcher: FetcherWithComponents<any>;
}) {
  const cartId = useContext(CartIdContext);

  return (
    <div className={isUpdatingQuantity ? "hidden" : "w-full sm:w-auto"}>
      {/* Using this pattern (using CSS display) as opposed to conditionally
      rendering the node, because it still needs to exist in the DOM tree
      to perform the form submit */}
      <fetcher.Form
        method="post"
        action="/"
        className="flex flex-row gap-2 my-2"
      >
        <button
          className="btn btn-outline btn-md flex-grow sm:btn-circle"
          type="button"
          onClick={() => setIsUpdatingQuantity(!isUpdatingQuantity)}
        >
          <EditIcon />
        </button>

        <button
          className="btn btn-outline btn-md flex-grow sm:btn-circle"
          type="submit"
          name="_action"
          value={"removeLineItems"}
          onClick={handleRemoveLineItem}
        >
          <TrashIcon />
        </button>
        <input type="hidden" name="cartId" value={cartId} />
        <input type="hidden" name="lineItemId" value={lineItemId} />
      </fetcher.Form>
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
  const cartId = useContext(CartIdContext);

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
    <div className={isUpdatingQuantity ? "w-full sm:w-auto" : "hidden"}>
      {/* Using this pattern (using CSS display) as opposed to conditionally
    rendering the node, because it still needs to exist in the DOM tree
    to perform the form submit */}
      <fetcher.Form method="post" action="/" className="form-control py-4">
        <label htmlFor="changeQuantityInput" className="text-base-300 mb-2">
          Available quantity: {quantityAvailable}
        </label>
        <div className="flex flex-row w-full">
          <input
            type="number"
            id="changeQuantityInput"
            inputMode="numeric"
            className="input input-bordered mr-1"
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
            className="btn btn-secondary lowercase flex-grow mx-1"
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
            className="btn btn-outline lowercase flex-grow mx-1"
            type="reset"
            onClick={() => {
              setIsUpdatingQuantity(false);
            }}
          >
            Cancel
          </button>
        </div>
        <input type="hidden" name="cartId" value={cartId} />
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
  fetcher,
}: {
  item: CartLineItemInterface;
  fetcher: FetcherWithComponents<any>;
}) {
  const [isRemoved, setIsRemoved] = useState(false);

  function handleRemoveLineItem() {
    setIsRemoved(true);
  }

  return (
    <AnimatePresence>
      {isRemoved ? null : (
        <motion.div
          className="card sm:card-side card-compact"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.175, ease: "easeInOut" }}
        >
          <CardImage
            imgUrl={item.merchandise?.image.url ?? ""}
            imgTitle={item.merchandise?.title ?? ""}
            productHandle={item.merchandise?.product.handle}
          />
          <CardBody
            lineItem={item}
            fetcher={fetcher}
            handleRemoveLineItem={handleRemoveLineItem}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
