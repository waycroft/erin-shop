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
};

export default function ProductGallery({ products }: { products: Product[] }) {
  return (
    <div className="bg-amber-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {products.map((product) => (
        <ProductThumbnail key={product.id} img={product.featuredImage.url} />
      ))}
    </div>
  );
}
