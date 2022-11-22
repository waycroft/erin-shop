import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import type { Options as SplideOptions } from "@splidejs/react-splide";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { useContext, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import ServerError from "~/components/ServerError";
import splideStyles from "~/styles/splide.min.css";
import { CartIdContext } from "~/utils/cartContext";
import { editCart } from "~/utils/cartUtils";
import formatNumberIntoCurrency from "~/utils/helpers/formatCurrency";
import {
  getSingleProduct,
  getVariantBySelectedOptions,
  Product,
  ProductVariant,
} from "~/utils/productUtils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: splideStyles }];
};

export const meta: MetaFunction = ({ data }) => {
  const title = "Erin Hoffman: Collect:" + data.data.product.title;
  const description = "The product page for " + data.data.product.title;
  const img = data.data.product.images.edges[0].node.url;
  return {
    title: title,
    description: description,
    "og:image": img,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { productHandle } = params;
  invariant(productHandle, "No product handle was provided");

  const productRes = await getSingleProduct(productHandle);
  const product = productRes.data.product;
  invariant(product, "No product was found");

  const defaultVariant = product.variants.edges[0].node;
  const selectedOptions = parseSelectedOptionsFromQueryParams(request);

  if (selectedOptions.length > 0) {
    const { data } = await getVariantBySelectedOptions(
      productHandle,
      selectedOptions
    );
    const selectedVariant = data.product?.variantBySelectedOptions;
    invariant(selectedVariant, "No variant was found based on selection");
    return json({
      data: {
        product,
        selectedVariant: selectedVariant,
      },
    });
  } else {
    return json({
      data: {
        product,
        selectedVariant: defaultVariant,
      },
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");
  invariant(_action, "No action was provided");
  const action = _action.toString();

  const isCartAction =
    action === "addLineItems" ||
    action === "updateLineItems" ||
    action === "removeLineItems";

  if (isCartAction) {
    return json(await editCart(action, formData));
  }
};

type LoaderData = {
  data: {
    product: Product;
    selectedVariant: ProductVariant;
  };
};

function parseSelectedOptionsFromQueryParams(request: Request) {
  const selectedOptions: { name: string; value: string }[] = [];

  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.search);
  for (const [key, value] of queryParams) {
    if (key.indexOf("options_") > -1) {
      const optionName = key.replace("options_", "");
      selectedOptions.push({ name: optionName, value: value });
    }
  }
  return selectedOptions;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ServerError />;
}

export default function SingleProductRoute() {
  const { data } = useLoaderData<LoaderData>();
  const product = data.product;
  const availableForSale = product.availableForSale;
  const selectedVariant = data.selectedVariant;
  const productHasNoOptions =
    product.options.length === 1 && product.options[0].values.length === 1;
  const mainSplideElem = useRef<Splide>(null);
  const thumbnailSplideElem = useRef<Splide>(null);

  const cartId = useContext(CartIdContext);
  const transition = useTransition();
  const submit = useSubmit();
  const [params] = useSearchParams();

  const [roundedMinPrice, roundedMaxPrice] = [
    formatNumberIntoCurrency(product.priceRange.minVariantPrice.amount),
    formatNumberIntoCurrency(product.priceRange.maxVariantPrice.amount),
  ];

  const mainSplideCarouselOptions: SplideOptions = {
    type: "fade",
    perPage: 1,
    arrows: false,
    pagination: false,
  };
  const thumbnailSplideCarouselOptions: SplideOptions = {
    type: "slide",
    rewind: true,
    gap: "1rem",
    pagination: false,
    fixedWidth: 110,
    fixedHeight: 70,
    cover: true,
    isNavigation: true,
    updateOnMove: true,
    paginationKeyboard: true,
    focus: "center",
    trimSpace: "move",
  };

  useEffect(() => {
    if (
      mainSplideElem &&
      thumbnailSplideElem &&
      mainSplideElem.current &&
      thumbnailSplideElem.current
    ) {
      invariant(thumbnailSplideElem.current.splide, "No splide instance");
      mainSplideElem.current.sync(thumbnailSplideElem.current.splide);
    }
  }, []);

  useEffect(() => {
    console.log("mainSplideElem", mainSplideElem);
  }, [mainSplideElem]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8 container mx-auto">
      <div className="flex flex-col gap-4">
        <Splide
          aria-label="Product images"
          ref={mainSplideElem}
          hasTrack={false}
          options={mainSplideCarouselOptions}
        >
          <SplideTrack>
            {product.images.edges.map((image) => (
              <SplideSlide key={image.node.id}>
                <img
                  src={image.node.url}
                  alt={image.node.altText}
                  className="rounded-lg"
                />
              </SplideSlide>
            ))}
          </SplideTrack>
        </Splide>
        {product.images.edges.length > 1 ? (
          <Splide
            aria-label="Product thumbnails"
            ref={thumbnailSplideElem}
            hasTrack={false}
            options={thumbnailSplideCarouselOptions}
          >
            <SplideTrack>
              {product.images.edges.map((image) => (
                <SplideSlide key={image.node.id} className="rounded-lg">
                  <img src={image.node.url} alt={image.node.altText} />
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
        ) : null}
      </div>
      <div>
        <h1 className="text-5xl font-medium mb-8 font-title">
          {product.title}
        </h1>
        {product.descriptionHtml.length > 0 ? (
          <div
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            className="mb-8 py-4 rounded-lg"
          />
        ) : null}
        <div>
          {!availableForSale ? (
            <div>
              <p>
                <strong className="text-error">Sold out</strong>
              </p>
            </div>
          ) : (
            <div className="my-4">
              <p>
                <strong>Price: </strong>
                {productHasNoOptions
                  ? roundedMinPrice
                  : `${roundedMinPrice} - ${roundedMaxPrice}`}
              </p>
            </div>
          )}
        </div>
        {productHasNoOptions ? null : (
          <Form method="get">
            <div className="flex flex-col w-full my-4 form-control">
              <div className="my-2">
                <h2 className="text-lg font-bold my-2">Options</h2>
                {product.options.map((option) => (
                  <div key={option.id} className="">
                    <label htmlFor={option.name} className="label">
                      <span className="label-text">{option.name}</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      name={"options_" + option.name}
                      defaultValue={params
                        .get("options_" + option.name)
                        ?.toString()}
                      onChange={(e) => submit(e.currentTarget.form)}
                    >
                      {option.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </Form>
        )}
        <Form method="post">
          <div className="flex flex-col w-full my-4 form-control">
            <input type="hidden" name="cartId" value={cartId} readOnly />
            <input
              type="hidden"
              name="merchandiseId"
              value={selectedVariant.id}
              readOnly
            />
            {availableForSale ? (
              <div>
                <div className="my-2">
                  <label htmlFor="quantity" className="label">
                    <span className="label-text">Quantity</span>
                    <span className="label-text-alt">
                      {selectedVariant.quantityAvailable} available
                    </span>
                  </label>
                </div>
                <div className="input-group flex flex-row">
                  <input
                    type="number"
                    inputMode="numeric"
                    name="quantity"
                    className="input input-bordered flex-grow"
                    defaultValue={1}
                    min={0}
                    max={selectedVariant.quantityAvailable}
                  />
                  <button
                    className="btn w-1/2 sm:w-5/12"
                    name="_action"
                    value="addLineItems"
                    type="submit"
                    disabled={transition.state === "submitting"}
                  >
                    {transition.type === "actionSubmission"
                      ? "Added!"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </Form>
      </div>
    </div>
  );
}
