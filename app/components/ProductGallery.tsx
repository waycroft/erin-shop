import ProductThumbnail from "./ProductThumbnail";

export default function ProductGallery() {
  return (
    <div className="bg-amber-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      <ProductThumbnail img="https://placekitten.com/400/600" />
      <ProductThumbnail img="https://placekitten.com/400/600" />
      <ProductThumbnail img="https://placekitten.com/400/600" />
      <ProductThumbnail img="https://placekitten.com/400/600" />
    </div>
  );
}
