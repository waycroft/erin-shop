import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

function ErrorButton({ fetcher }: { fetcher: ReturnType<typeof useFetcher> }) {
  return (
    <button
      type="submit"
      name="_action"
      value="addLineItem"
      className="btn btn-primary lowercase w-40 h-fit leading-4 py-4 bg-error hover:bg-error border-none font-bold"
    >
      {fetcher.state !== "idle"
        ? "Trying..."
        : "Oh no, couldn't add to cart. 😢 Try again?"}
    </button>
  );
}

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
  const addToCartFailed = fetcher.data?.error;

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
          {!!addToCartFailed ? (
            <ErrorButton fetcher={fetcher} />
          ) : (
            <button
              type="submit"
              className="btn btn-primary lowercase w-40"
              name="_action"
              value="addLineItem"
            >
              {fetcher.state !== "idle" ? "added!" : "add to cart"}
            </button>
          )}
        </fetcher.Form>
      </div>
    </div>
  );
}
