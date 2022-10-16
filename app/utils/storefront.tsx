export default async function (query: string, variables = {}) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "X-Shopify-Storefront-Access-Token",
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string
  );

  let res: Response;
  try {
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
    return res;
  } catch (err) {
    console.error(err);
  }
}
