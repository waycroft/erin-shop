import { Link } from "@remix-run/react";
import ProductThumbnail from "./ProductThumbnail";

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
};

export default function ProductsGallery({ products }: { products: Product[] }) {
  return (
    <div className="bg-emerald-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {products.map((product) => (
        <Link to={`/piece/${product.handle}`}>
          <ProductThumbnail key={product.id} img={product.featuredImage.url} />
          {/* TODO: delete this line */}
          {/* <caption className="text-center text-white">{product.handle}</caption> */}
        </Link>
      ))}
    </div>
  );
}
