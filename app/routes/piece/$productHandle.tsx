import { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { getSingleProduct, Product } from "~/utils/productUtils";

export const loader: LoaderFunction = async ({ params }) => {
  const { productHandle } = params;
  invariant(productHandle, "No product handle was provided");
  return await getSingleProduct(productHandle);
};

type LoaderData = {
  data: {
    product: Product;
  };
};

export default function SingleProductRoute() {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { data } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const product = data.product;
  const featuredImage = product.images?.edges[0].node;
  const productHasNoOptions =
    product.options.length === 1 && product.options[0].values.length === 1;

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

  const handleChangeSelectedQuantity = (event: React.ChangeEvent) => {
    setSelectedQuantity(Number((event.target as HTMLInputElement).value));
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
        <fetcher.Form method="post" action="/">
          <input type="hidden" name="productHandle" value={product.handle} />
          <input
            type="hidden"
            name="merchandise"
            value={JSON.stringify([
              {
                merchandiseId: product.variants.edges[0].node.id,
                quantity: selectedQuantity,
              },
            ])}
          />
          <div className="flex flex-col w-full my-4 form-control">
            {product.options.map((option) => (
              <div key={option.id} className="my-3">
                <label htmlFor="variant" className="label">
                  <span className="label-text">{option.name}</span>
                </label>
                <select className="select select-bordered w-full">
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <label htmlFor="quantity" className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              name="quantity"
              className="input input-bordered"
              defaultValue={1}
              onChange={handleChangeSelectedQuantity}
              min={0}
              max={product.totalInventory}
            />
            <button
              className="btn btn-primary my-4"
              name="_action"
              value="addLineItems"
              type="submit"
            >
              {fetcher.state !== "idle" ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
