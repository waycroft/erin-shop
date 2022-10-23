import storefront from "./storefront";

var gql = String.raw;

export async function getProducts(quantity: number) {
  const res = await storefront(
    gql`query getAllProducts {
      products(first: ${quantity}) {
        edges {
          node {
            availableForSale
            descriptionHtml
            featuredImage {
              height
              width
              id
              url
              altText
            }
            id
            productType
            title
            handle
            title
            ... on Product {
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }`
  );
  return res;
}