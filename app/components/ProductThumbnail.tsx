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

function ProductHoverActionButtons({
  fetcher,
  addToCartFailed,
  productSlug,
  productVariantId,
}: {
  fetcher: ReturnType<typeof useFetcher>;
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
        <input type="hidden" name="productVariantId" value={productVariantId} />
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
  );
}

function ToastNotification({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div className="toast">
      <div className="alert alert-success flex flex-col">
        <p>{message}</p>
        <Link to="/cart" className="font-bold underline">
          Go to cart
        </Link>
      </div>
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

  // BOOKMARK: I want to use setTimeout to fade out toast.

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
