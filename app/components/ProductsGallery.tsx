import { Link } from "@remix-run/react";
import { Product } from "~/routes/piece/$productHandle";
import ProductThumbnail from "./ProductThumbnail";

export default function ProductsGallery({ products }: { products: Product[] }) {
  return (
    <div className="bg-emerald-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      {products.map((product) => (
        <Link to={`/piece/${product.handle}`} key={product.id}>
          {product &&
          (product.featuredImage || product.images?.edges[0]?.node) ? (
            <ProductThumbnail
              key={product.id}
              productVariantId={product.variants.edges[0].node.id}
              img={
                product.featuredImage.url ?? product.images.edges[0].node.url
              }
            />
          ) : (
            <div>(Missing product thumbnail</div>
          )}
        </Link>
      ))}
    </div>
  );
}
