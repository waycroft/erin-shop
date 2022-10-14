import ProductThumbnail from "./ProductThumbnail";

export default function ProductGallery() {
  return (
    <div className="bg-amber-600 grid grid-cols-3 gap-4">
      <ProductThumbnail img="https://placekitten.com/400/600" />
      <ProductThumbnail img="https://placekitten.com/400/600" />
      <ProductThumbnail img="https://placekitten.com/400/600" />
      <ProductThumbnail img="https://placekitten.com/400/600" />
    </div>
  );
}
