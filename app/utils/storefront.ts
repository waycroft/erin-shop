import { Cart } from "./cartUtils";
import { Product } from "./productUtils";

export type StorefrontAPIResponseObject = {
  data: {
    product? : Product;
    cart?: Cart;
    cartCreate?: {
      cart: Cart;
    }
  }
  errors?: {
    message: string;
  }[];
  userErrors?: {
    field: string;
    message: string;
  }[];
};

export default async function (
  query: string,
  variables = {}
): Promise<StorefrontAPIResponseObject> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "X-Shopify-Storefront-Access-Token",
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string
  );
  headers.append("Shopify-Storefront-Private-Token", process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN as string);

  let res: Response;
  res = await fetch(
    "https://erin-hoffmans-store.myshopify.com/api/2022-10/graphql.json",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );
  const json: StorefrontAPIResponseObject = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  if (json.userErrors && json.userErrors.length > 0) {
    console.error(json.userErrors);
  }
  return json;
}
