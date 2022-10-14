export default function ProductThumbnail({ img, alt, title }: { img: string; alt?: string; title?: string }) {
  return (
    <img src={img} alt={alt} title={title} />
  )
}