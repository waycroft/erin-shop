import {
  FetcherWithComponents,
  Link, useFetcher
} from "@remix-run/react";
import ToastNotification from "./ToastNotification";

function ErrorButton({ fetcher }: { fetcher: FetcherWithComponents<any> }) {
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
  addToCartFailed,
  productSlug,
  productVariantId,
  fetcher,
}: {
  addToCartFailed: boolean;
  productSlug: string;
  productVariantId: string;
  fetcher: FetcherWithComponents<any>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Link to={`/piece/${productSlug}`}>
        <button className="btn btn-secondary lowercase w-40">view</button>
      </Link>
      <fetcher.Form method="post" action="/">
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

  return (
    <div className="relative">
      <div>
        <Link to={`/piece/${productSlug}`}>
          <img
            src={img}
            alt={alt}
            className="w-full h-full object-cover rounded-lg"
          />
        </Link>
      </div>
      <div className="hidden md:grid grid-col-1 gap-4 absolute inset-0 bg-black bg-opacity-50 opacity-0 md:hover:opacity-100 transition ease-in duration-75 place-content-center">
        <ProductHoverActionButtons
          addToCartFailed={fetcher.type === "done" && fetcher.data}
          productSlug={productSlug}
          productVariantId={productVariantId}
          fetcher={fetcher}
        />
      </div>
      {fetcher.type === "done" ? (
        fetcher.data ? (
          <ToastNotification
            type="error"
            message="Whoops, something went wrong. Please try again."
            action={{ label: "Go to cart", href: "/cart" }}
          />
        ) : (
          <ToastNotification
            type="success"
            message="Added to cart!"
            action={{ label: "Go to cart", href: "/cart" }}
          />
        )
      ) : null}
    </div>
  );
}
