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
      staggerChildren: 0.05,
    },
  },
};

export default function ProductsGallery({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {products.map((product) =>
        product && (product.featuredImage || product.images?.edges[0]?.node) ? (
          <ProductThumbnail
            key={product.id}
            product={product}
          />
        ) : (
          <div>(Missing product thumbnail)</div>
        )
      )}
    </motion.div>
  );
}
