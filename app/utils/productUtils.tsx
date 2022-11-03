import storefront from "./storefront";

var gql = String.raw;

export type PriceRange = {
  maxVariantPrice: {
    amount: string;
  };
  minVariantPrice: {
    amount: string;
  };
};

export type Product = {
  availableForSale: boolean;
  description: string;
  descriptionHtml: string;
  featuredImage: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
  };
  images: {
    edges: {
      node: {
        altText: string;
        height: number;
        width: number;
        id: string;
        url: string;
      };
    }[];
  };
  id: string;
  productType: string;
  title: string;
  handle: string;
  totalInventory: number;
  tags: string[];
  priceRange: PriceRange;
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
};

export type ProductVariant = {
  id: string;
  title: string;
  price: string;
  sku: string;
  image: {
    height: number;
    width: number;
    id: string;
    url: string;
    altText: string;
  };
  product: Product;
  quantityAvailable: number;
};

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
              # url
              url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER })
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
                  url(
                    transform: { maxWidth: 1200, maxHeight: 1200, crop: CENTER }
                  )
                  # url
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
