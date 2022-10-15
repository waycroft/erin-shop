import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PrimaryNav from "~/components/PrimaryNav";
import ProductGallery, { Product } from "~/components/ProductGallery";
import storefront from "~/utils/storefront";

type LoaderData = {
  data: {
    products: {
      nodes: Product[];
    };
  };
};

export const loader: LoaderFunction = async () => {
  // TODO: need to fetch a smaller image size for thumbnails
  const res = await storefront(
    `query getAllProducts {
      products(first: 12) {
        nodes {
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
        }
      }
    }`
  );
  return res;
};

export function ErrorBoundary() {
  return (
    <div>
      <section>
        <PrimaryNav />
      </section>
      <section className="flex flex-col w-screen h-96 place-content-center">
        <div className="alert alert-error w-fit">
          <h1>Something went wrong!</h1>
        </div>
      </section>
    </div>
  );
}

export default function Index() {
  const { data } = useLoaderData<LoaderData>();
  const products = data.products.nodes;

  return (
    <div>
      <section>
        <PrimaryNav />
      </section>
      <section>
        <ProductGallery products={products} />
      </section>
    </div>
  );
}
