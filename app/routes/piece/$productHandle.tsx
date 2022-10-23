import { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { getSingleProduct } from "~/utils/productUtils";

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

type PriceRange = {
  maxVariantPrice: {
    amount: string;
  };
  minVariantPrice: {
    amount: string;
  };
};

export type Product = {
  availableForSale: boolean;
  description: string;
  descriptionHtml: string;
  featuredImage: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
  };
  images: {
    edges: {
      node: {
        altText: string;
        height: number;
        width: number;
        id: string;
        url: string;
      };
    }[];
  };
  id: string;
  productType: string;
  title: string;
  handle: string;
  totalInventory: number;
  tags: string[];
  priceRange: PriceRange;
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
};

export type ProductVariant = {
  id: string;
  title: string;
  price: string;
  sku: string;
  image: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
  };
  product: Product;
};

export default function SingleProductRoute() {
  const { data } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const actionData = fetcher.data;
  const product = data.product;
  const featuredImage = product.images?.edges[0].node;
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleChangeSelectedQuantity = (event: React.ChangeEvent) => {
    setSelectedQuantity(Number((event.target as HTMLInputElement).value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8">
      <div className="bg-slate-200">
        <img
          src={featuredImage?.url}
          alt={featuredImage?.altText}
          width="400"
        />
      </div>
      <div className="bg-slate-200">
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        <div>
          <p>
            <strong>Available?</strong>
          </p>
          <p>{product.availableForSale.toString()}</p>
          <p>
            <strong># Available</strong>
          </p>
          <p>{product.totalInventory}</p>
          <p>
            <strong>Tags</strong>
          </p>
          <p>{product.tags.join(", ")}</p>
          <p>
            <strong>Price</strong>
          </p>
          <p>{"$" + product.priceRange.maxVariantPrice.amount}</p>
          <p>
            <strong>Product Type</strong>
          </p>
          <p>{product.productType}</p>
        </div>
        <fetcher.Form method="post" action="/cart">
          <input type="hidden" name="productHandle" value={product.handle} />
          {/* TODO: Once Erin starts adding variants, change this */}
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
          <div className="flex flex-col w-fit my-4">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              defaultValue={selectedQuantity}
              className="input input-primary"
              onChange={handleChangeSelectedQuantity}
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
