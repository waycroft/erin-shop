import storefront from "./storefront";

var gql = String.raw;

export async function getProducts(quantity: number) {
  return await storefront(
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
}

export async function getSingleProduct(productHandle: string) {
  return await storefront(
    gql`
      query getProductByHandle($handle: String) {
        product(handle: $handle) {
          availableForSale
          descriptionHtml
          id
          tags
          title
          handle
          totalInventory
          productType
          priceRange {
            maxVariantPrice {
              amount
            }
            minVariantPrice {
              amount
            }
          }
          ... on Product {
            images(first: 1) {
              edges {
                node {
                  altText
                  id
                  height
                  width
                  url
                }
              }
            }
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
    `,
    { handle: productHandle }
  );
}
