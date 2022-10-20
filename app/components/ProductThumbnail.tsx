import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function ProductThumbnail({
  img,
  alt,
  title,
  productVariantId,
  productSlug,
}: {
  img: string;
  alt?: string;
  title?: string;
  productVariantId: string;
  productSlug: string;
}) {
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.type === "done") {
      fetcher.load("/cart");
    }
  });

  return (
    <div className="relative">
      <img src={img} alt={alt} className="w-full h-full object-cover" />
      <div className="grid grid-col-1 gap-4 absolute inset-0 bg-black bg-opacity-50 opacity-0 md:hover:opacity-100 transition ease-in duration-75 place-content-center">
        <Link to={`/piece/${productSlug}`}>
          <button className="btn btn-secondary lowercase w-40">view</button>
        </Link>
        <fetcher.Form method="post" action="/cart">
          <input
            type="hidden"
            name="productVariantId"
            value={productVariantId}
          />
          <input type="hidden" name="quantity" value="1" />
          <button
            type="submit"
            className="btn btn-primary lowercase w-40"
            name="_action"
            value="addLineItem"
          >
            {fetcher.type === "actionSubmission"
              ? "adding..."
              : fetcher.type === "done"
              ? "added!"
              : "add to cart"}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
