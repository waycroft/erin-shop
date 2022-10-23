import { FetcherWithComponents, Link, useFetcher } from "@remix-run/react";
import ToastNotification from "./ToastNotification";

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

function ProductHoverActionButtons({
  fetcher,
  addToCartFailed,
  productSlug,
  productVariantId,
}: {
  fetcher: FetcherWithComponents<any>;
  addToCartFailed: boolean;
  productSlug: string;
  productVariantId: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Link to={`/piece/${productSlug}`}>
        <button className="btn btn-secondary lowercase w-40">view</button>
      </Link>
      <fetcher.Form method="post" action="/cart">
        <input
          type="hidden"
          name="merchandise"
          value={JSON.stringify([
            { merchandiseId: productVariantId, quantity: 1 },
          ])}
        />
        {!!addToCartFailed ? (
          <ErrorButton fetcher={fetcher} />
        ) : (
          <button
            type="submit"
            className="btn btn-primary lowercase w-40"
            name="_action"
            value="addLineItems"
          >
            {fetcher.state !== "idle" ? "added!" : "add to cart"}
          </button>
        )}
      </fetcher.Form>
    </div>
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
      <div>
        <Link to={`/piece/${productSlug}`}>
          <img src={img} alt={alt} className="w-full h-full object-cover" />
        </Link>
      </div>
      <div className="hidden md:grid grid-col-1 gap-4 absolute inset-0 bg-black bg-opacity-50 opacity-0 md:hover:opacity-100 transition ease-in duration-75 place-content-center">
        <ProductHoverActionButtons
          fetcher={fetcher}
          addToCartFailed={!!addToCartFailed}
          productSlug={productSlug}
          productVariantId={productVariantId}
        />
      </div>
      {fetcher.type === "done" && !!!addToCartFailed ? (
        <ToastNotification type="success" message="Added to cart!" />
      ) : null}
    </div>
  );
}
