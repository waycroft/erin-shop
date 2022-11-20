import { Product } from "~/utils/productUtils";
import ProductThumbnail from "./ProductThumbnail";
import { motion } from "framer-motion";

const stagger = {
  hidden: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  visible: {
    transition: {
      // delayChildren: -0.1,
      staggerChildren: 0.1,
    },
  },
};

export default function ProductsGallery({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {products.map((product) =>
        product && (product.featuredImage || product.images?.edges[0]?.node) ? (
          <ProductThumbnail
            key={product.id}
            productVariantId={product.variants.edges[0].node.id}
            productSlug={product.handle}
            img={
              product.featuredImage?.url ?? product.images?.edges[0].node.url
            }
          />
        ) : (
          <div>(Missing product thumbnail)</div>
        )
      )}
    </motion.div>
  );
}
