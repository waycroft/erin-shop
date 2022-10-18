import { useFetcher } from "@remix-run/react";

export default function ProductThumbnail({
  img,
  alt,
  title,
  productVariantId,
}: {
  img: string;
  alt?: string;
  title?: string;
  productVariantId: string;
}) {
  const fetcher = useFetcher();
  return (
    <div className="relative">
      <img src={img} alt={alt} className="w-full h-full object-cover" />
      <div className="grid grid-col-1 gap-4 absolute inset-0 bg-black bg-opacity-50 opacity-0 md:hover:opacity-100 transition ease-in duration-75 place-content-center">
        <button className="btn btn-secondary lowercase w-40">view</button>
        <fetcher.Form method="post" action="/cart">
          {/* BOOKMARK: The link in the parent route is preventing this form from submitting */}
          <input type="hidden" name="merchandiseId" value={productVariantId} />
          <input type="hidden" name="quantity" value="1" />
          <button
            type="submit"
            className="btn btn-primary lowercase w-40"
            name="_action"
            value="addLineItem"
          >
            {fetcher.state === "submitting" ? "adding..." : "add to cart"}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
