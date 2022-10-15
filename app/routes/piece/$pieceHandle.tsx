import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Product } from "~/components/ProductGallery";
import storefront from "~/utils/storefront";

export const loader: LoaderFunction = async ({ params }) => {
  const { pieceHandle } = params;
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
      }
    }`,
    {
      "handle": pieceHandle,
    }
  );
  return res;
};

type LoaderData = {
  data: {
    product: Product;
  }
};

export default function SinglePieceRoute() {
  const { data } = useLoaderData<LoaderData>();
  const product = data.product;

  return (
    <div>
      <h1>{product.title}</h1>
      <img
        src={product.featuredImage.url}
        alt={product.featuredImage.altText}
      />
    </div>
  );
}
