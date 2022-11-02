import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductsGallery from "~/components/ProductsGallery";
import ServerError from "~/components/ServerError";
import { getProducts, Product } from "~/utils/productUtils";

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
  console.error(error);
  return <ServerError />;
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
