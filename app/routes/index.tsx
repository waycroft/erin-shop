import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductsGallery from "~/components/ProductsGallery";
import { getProducts } from "~/utils/productUtils";
import { Product } from "~/utils/productUtils";

type LoaderData = {
  data: {
    products: {
      edges: { node: Product }[];
    };
  };
};

export const loader: LoaderFunction = async () => {
  // TODO: need to fetch a smaller image size for thumbnails
  const products = await getProducts(12);
  return products;
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
