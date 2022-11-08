import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import invariant from "tiny-invariant";
import ServerError from "~/components/ServerError";
import { CartLineItemInterface, editCart } from "~/utils/cartUtils";
import { getSingleProduct, Product } from "~/utils/productUtils";

export const loader: LoaderFunction = async ({ params }) => {
  const { productHandle } = params;
  invariant(productHandle, "No product handle was provided");
  const data = await getSingleProduct(productHandle);
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");
  invariant(_action, "No action was provided");
  const action = _action.toString();
  const isOptionChangeAction = action === "changeOption";
  const isCartAction =
    action === "addLineItems" ||
    action === "updateLineItems" ||
    action === "removeLineItems";

  if (isCartAction) {
    return json(await editCart(action, formData));
  }
};

type LoaderData = {
  data: {
    product: Product;
  };
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ServerError />;
}

export default function SingleProductRoute() {
  const { data } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const product = data.product;
  const featuredImage = product.images?.edges[0].node;
  const productHasNoOptions =
    product.options.length === 1 && product.options[0].values.length === 1;

  const [selectedOptions, setSelectedOptions] = useState(
    product.options.reduce((accumulator, currentOption) => {
      accumulator[currentOption.name] = currentOption.values[0];
      return accumulator;
    }, {} as Record<string, string>)
  );

  // TODO: add a state for the selected options
  // When the user selects an option, update the state
  // (updates image too––that way user gets immediate feedback on what they're adding to cart)
  // Add the query output for getVariantBySelectedOptions into the loader data
  // such then when the state is updated, the loader gets the exact variant to be used for the add to cart mutation

  const [roundedMinPrice, roundedMaxPrice] = [
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(product.priceRange.minVariantPrice.amount)),
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(product.priceRange.maxVariantPrice.amount)),
  ];

  const handleChangeSelectedOptions = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8">
      <div className="bg-slate-200 rounded-lg overflow-hidden">
        {/* TODO: Change the carousel to match the selected product option */}
        <img src={featuredImage?.url} alt={featuredImage?.altText} />
      </div>
      <div className="">
        <h1 className="text-5xl font-medium mb-8 font-title">
          {product.title}
        </h1>
        <div
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          className="mb-8 bg-base-200 p-4 rounded-lg"
        />
        <div>
          {product.totalInventory <= 0 ? (
            <div>
              <p>
                <strong className="text-error">Sold out</strong>
              </p>
            </div>
          ) : null}
          <div className="my-4">
            <p>
              <strong># Available: </strong>
              {product.totalInventory}
            </p>
          </div>
          <div className="my-4">
            <p>
              <strong>Price: </strong>
              {productHasNoOptions
                ? roundedMinPrice
                : `${roundedMinPrice} - ${roundedMaxPrice}`}
            </p>
          </div>
        </div>
        <Form method="post">
          <input
            type="hidden"
            name="merchandiseId"
            value={product.variants.edges[0].node.id}
          />
          <div className="flex flex-col w-full my-4 form-control">
            <div className="my-2">
              <h2 className="text-lg font-bold my-2">Options</h2>
              {productHasNoOptions
                ? null
                : product.options.map((option) => (
                    <div key={option.id} className="">
                      <label htmlFor={option.name} className="label">
                        <span className="label-text">{option.name}</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={handleChangeSelectedOptions}
                        name={option.name}
                      >
                        {option.values.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
            </div>
            <div className="my-2">
              <label htmlFor="quantity" className="label">
                <span className="label-text">Quantity</span>
              </label>
            </div>
            <input
              type="number"
              inputMode="numeric"
              name="quantity"
              className="input input-bordered"
              defaultValue={1}
              min={0}
              max={product.totalInventory}
            />
            <button
              className="btn btn-block my-4"
              name="_action"
              value="addLineItems"
              type="submit"
            >
              {transition.state !== "idle" ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
