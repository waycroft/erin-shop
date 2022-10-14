export default function ProductThumbnail({
  img,
  alt,
  title,
}: {
  img: string;
  alt?: string;
  title?: string;
}) {
  return (
    <div>
      <img width="100%" src={img} alt={alt} title={title} />
    </div>
  );
}
