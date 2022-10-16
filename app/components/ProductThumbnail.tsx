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
      <div className="relative">
        <img src={img} alt={alt} className="w-full h-full object-cover" />
        <div className="grid grid-col-1 gap-4 absolute inset-0 bg-black bg-opacity-50 opacity-0 md:hover:opacity-100 transition ease-in duration-75 place-content-center">
          <button className="btn btn-secondary lowercase w-40">view</button>
          <button className="btn btn-primary lowercase w-40">
            add to cart
          </button>
        </div>
      </div>
      {/* <img width="100%" src={img} alt={alt} title={title} /> */}
    </div>
  );
}
