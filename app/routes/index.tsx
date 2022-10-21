import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductsGallery from "~/components/ProductsGallery";
import storefront from "~/utils/storefront";
import { Product } from "./piece/$productHandle";

type LoaderData = {
  data: {
    products: {
      edges: { node: Product }[];
    };
  };
};

export const loader: LoaderFunction = async () => {
  // TODO: need to fetch a smaller image size for thumbnails
  const res = await storefront(
    `query getAllProducts {
      products(first: 12) {
        edges {
          node {
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
            productType
            title
            handle
            title
            ... on Product {
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }`
  );
  return res;
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.message}</p>
      <p>Stack:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function Index() {
  const { data } = useLoaderData<LoaderData>();
  const products = data.products.edges.map((edge) => edge.node);

  return (
    <div>
      <section>
        <ProductsGallery products={products} />
      </section>
    </div>
  );
}
