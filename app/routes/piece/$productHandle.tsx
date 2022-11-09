import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import ServerError from "~/components/ServerError";
import { editCart } from "~/utils/cartUtils";
import {
  getSingleProduct,
  getVariantBySelectedOptions,
  Product,
  ProductVariant,
} from "~/utils/productUtils";

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
  const selectedVariant = data.selectedVariant;
  const featuredImage = product.images?.edges[0].node;
  const productHasNoOptions =
    product.options.length === 1 && product.options[0].values.length === 1;

  const transition = useTransition();
  const submit = useSubmit();
  const [params] = useSearchParams();

  const [roundedMinPrice, roundedMaxPrice] = [
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(product.priceRange.minVariantPrice.amount)),
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(product.priceRange.maxVariantPrice.amount)),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8">
      <div className="bg-slate-200 rounded-lg overflow-hidden">
        {/* TODO: Change the carousel to match the selected product option */}
        <img src={featuredImage?.url} alt={featuredImage?.altText} />
      </div>
      <div className="">
        <h1 className="text-5xl font-medium mb-8 font-title">
          {product.title}
        </h1>
        <div
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          className="mb-8 bg-base-200 p-4 rounded-lg"
        />
        <div>
          {product.totalInventory <= 0 ? (
            <div>
              <p>
                <strong className="text-error">Sold out</strong>
              </p>
            </div>
          ) : null}
          <div className="my-4">
            <p>
              <strong># Available: </strong>
              {product.totalInventory}
            </p>
          </div>
          <div className="my-4">
            <p>
              <strong>Price: </strong>
              {productHasNoOptions
                ? roundedMinPrice
                : `${roundedMinPrice} - ${roundedMaxPrice}`}
            </p>
          </div>
        </div>
        <Form method="get" onChange={(e) => submit(e.currentTarget)}>
          <div className="flex flex-col w-full my-4 form-control">
            <div className="my-2">
              <h2 className="text-lg font-bold my-2">Options</h2>
              {productHasNoOptions
                ? null
                : product.options.map((option) => (
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
            <div className="my-2">
              <label htmlFor="quantity" className="label">
                <span className="label-text">Quantity</span>
              </label>
            </div>
            <input
              type="number"
              inputMode="numeric"
              name="quantity"
              className="input input-bordered"
              defaultValue={Number(params.get("quantity")) || 1}
              min={0}
              max={product.totalInventory}
            />
            <input
              type="hidden"
              name="variantId"
              value={selectedVariant.id}
              readOnly
            />
          </div>
        </Form>
        <Form method="post">
          <input
            type="hidden"
            name="merchandiseId"
            value={params.get("variantId") ?? selectedVariant.id}
            readOnly
          />
          <input
            type="hidden"
            name="quantity"
            value={Number(params.get("quantity")) ?? 1}
            readOnly
          />
          <button
            className="btn btn-block my-4"
            name="_action"
            value="addLineItems"
            type="submit"
          >
            {transition.type === "actionSubmission" ? "Added!" : "Add to Cart"}
          </button>
        </Form>
      </div>
    </div>
  );
}
