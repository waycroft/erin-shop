import { FetcherWithComponents, Link, useFetcher } from "@remix-run/react";
import ToastNotification from "./ToastNotification";
import { motion } from "framer-motion";
import { useContext } from "react";
import { CartIdContext } from "~/utils/cartContext";

function ProductHoverActionButtons({
  productSlug,
  productVariantId,
  availableForSale,
  fetcher,
}: {
  productSlug: string;
  productVariantId: string;
  availableForSale: boolean;
  fetcher: FetcherWithComponents<any>;
}) {
  const cartId = useContext(CartIdContext);

  return (
    <div className="flex flex-col gap-2">
      <Link to={`/piece/${productSlug}`}>
        <button className="btn btn-outline lowercase w-40">view</button>
      </Link>
      <fetcher.Form method="post" action="/">
        <input type="hidden" name="cartId" value={cartId} />
        <input type="hidden" name="merchandiseId" value={productVariantId} />
        <input type="hidden" name="quantity" value={1} />
        {!availableForSale ? (
          <div className="tooltip" data-tip="Sold out.">
            <button
              type="submit"
              className="btn lowercase w-40"
              name="_action"
              value="addLineItems"
              disabled
            >
              {fetcher.state !== "idle" ? "added!" : "add to cart"}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="btn lowercase w-40"
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

const variants = {
  visible: { opacity: 1, x: 0, y: 0 },
  hidden: { opacity: 0, x: -15, y: -7.5 },
};

export default function ProductThumbnail({
  img,
  alt,
  productVariantId,
  productSlug,
  availableForSale,
}: {
  img: string;
  alt?: string;
  productVariantId: string;
  productSlug: string;
  availableForSale: boolean;
}) {
  const fetcher = useFetcher();

  return (
    <motion.div className="relative" variants={variants}>
      <div>
        <img
          src={img}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="hidden md:grid grid-col-1 gap-4 absolute inset-0 bg-base-100 bg-opacity-70 opacity-0 md:hover:opacity-100 transition ease-in duration-75 place-content-center rounded-lg">
        <ProductHoverActionButtons
          productSlug={productSlug}
          productVariantId={productVariantId}
          fetcher={fetcher}
          availableForSale={availableForSale}
        />
      </div>
      {fetcher.type === "done" ? (
        <ToastNotification
          type="success"
          message="Added to cart!"
          action={{ label: "Go to cart", href: "/cart" }}
        />
      ) : null}
    </motion.div>
  );
}
