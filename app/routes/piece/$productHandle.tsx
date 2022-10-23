import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { addLineItemsToCart, createAndAddToCart } from "~/utils/cartUtils";
import storefront from "~/utils/storefront";

export const loader: LoaderFunction = async ({ params }) => {
  const { productHandle } = params;
  const res = await storefront(
    `
      query getProductByHandle($handle: String) {
        product(handle: $handle) {
            availableForSale
            descriptionHtml
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
            ... on Product {
                images(first: 1) {
                    edges {
                        node {
                            altText
                            id
                            height
                            width
                            url
                        }
                    }
                }
                variants(first: 1) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    }`,
    { handle: productHandle }
  );
  return res;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const merchandiseId = formData.get("productVariantId")?.toString();
  const quantity = formData.get("quantity")?.toString();
  const productSlug = formData.get("productHandle")?.toString();

  if (!merchandiseId || !quantity) {
    return json(
      { error: "Missing merchandiseId or quantity" },
      { status: 400 }
    );
  }

  try {
    await addLineItemsToCart({
      cartId: process.env.TEST_CART as string,
      lines: [
        {
          merchandiseId: merchandiseId,
          quantity: parseInt(quantity),
        },
      ],
    });
  } catch (error: any) {
    console.error(error);
    return json({ error: error.message, status: 500 });
  }

  return null;
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
  featuredImage?: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
  };
  images?: {
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
  const product = data.product;
  const featuredImage = product.images?.edges[0].node;

  const transition = useTransition();

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
        <Form method="post">
          <input type="hidden" name="productHandle" value={product.handle} />
          <input
            type="hidden"
            name="productVariantId"
            value={product.variants.edges[0].node.id}
          />
          <div className="flex flex-col w-fit my-4">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              name="quantity"
              defaultValue="1"
              className="input input-primary"
            />
            <button className="btn btn-primary my-4" type="submit">
              {/* BOOKMARK: add indicator to cart when item is added.
              Increment number for items in cart.
              Also create toast notification to view cart. */}
              {transition.state !== "idle" ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
