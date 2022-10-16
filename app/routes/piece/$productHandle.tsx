import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import storefront from "~/utils/storefront";

export const loader: LoaderFunction = async ({ params }) => {
  const { productHandle } = params;
  const res = await storefront(
    `query getProductByHandle($handle: String) {
      product(handle: $handle) {
        availableForSale
        descriptionHtml
        featuredImage {
          height
          width
          id
          url
          altText
        }
        id
        tags
        title
        handle
        totalInventory
        productType
        priceRange {
            maxVariantPrice {
                amount
            }
            minVariantPrice {
                amount
            }
        }
      }
    }`,
    {
      handle: productHandle,
    }
  );
  return res;
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
  descriptionHtml: string;
  featuredImage: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
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
  image: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
  };
};

export default function SingleProductRoute() {
  const { data } = useLoaderData<LoaderData>();
  const product = data.product;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8">
      <div className="bg-slate-200">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
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
      </div>
    </div>
  );
}
