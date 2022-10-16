import { Link } from "@remix-run/react";
import { Product } from "~/routes/piece/$productHandle";
import ProductThumbnail from "./ProductThumbnail";

export default function ProductsGallery({ products }: { products: Product[] }) {
  return (
    <div className="bg-emerald-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      {products.map((product) => (
        <Link to={`/piece/${product.handle}`}>
          {product &&
          (product.featuredImage || product.images?.edges[0]?.node) ? (
            <ProductThumbnail
              key={product.id}
              img={
                product.featuredImage.url ?? product.images.edges[0].node.url
              }
            />
          ) : (
            <div>(Missing product thumbnail</div>
          )}
          {/* TODO: delete this line */}
          {/* <caption className="text-center text-white">{product.handle}</caption> */}
        </Link>
      ))}
    </div>
  );
}
