import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductsGallery from "~/components/ProductsGallery";
import ServerError from "~/components/ServerError";
import { getProducts, Product } from "~/utils/productUtils";

export const loader: LoaderFunction = async () => {
  // TODO: need to fetch a smaller image size for thumbnails
  const data = await getProducts(100);
  return data;
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ServerError />;
}

type LoaderData = {
  data: {
    products: {
      edges: { node: Product }[];
    };
  };
};

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
