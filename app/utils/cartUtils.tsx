import storefront from "./storefront";

type Merchandise = {
  merchandiseId: string;
  quantity: number;
};

var gql = String.raw;

export async function getCart(cartId: string): Promise<Response | undefined> {
  return await storefront(
    gql`
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
            id
            checkoutUrl
            cost {
                subtotalAmount {
                    amount
                }
            }
            totalQuantity
            updatedAt
            createdAt
            lines(first: 10) {
                edges {
                    node {
                        id
                        quantity
                        merchandise {
                            ... on ProductVariant {
                              id
                              title
                              price {
                                  amount
                              }
                              image {
                                  url
                                  altText
                              }
                              sku
                              product {
                                  id
                                  title
                                  handle
                                  description
                              }
                            }
                        }
                    }
                }
            }
        }
    }`,
    {
      cartId: cartId,
    }
  );
}

export async function createAndAddToCart({
  lines,
  attributes = {},
}: {
  lines: Merchandise[];
  attributes?: object;
}): Promise<Response | undefined> {
  return await storefront(
    gql`
      mutation cartCreate($cartInput: CartInput) {
        cartCreate(input: $cartInput) {
          cart {
              id
              checkoutUrl
              cost {
                  subtotalAmount {
                      amount
                  }
              }
              totalQuantity
              updatedAt
              createdAt
              lines(first: 10) {
                  edges {
                      node {
                          id
                          quantity
                          merchandise {
                              ... on ProductVariant {
                                id
                                title
                                price {
                                    amount
                                }
                                image {
                                    url
                                    altText
                                }
                                sku
                                product {
                                    id
                                    title
                                    handle
                                    description
                                }
                              }
                          }
                      }
                  }
              }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartInput: {
        lines: lines,
        attributes: attributes,
      },
    }
  );
}

export async function addLineItemsToCart({
  cartId,
  lines,
}: {
  cartId: string;
  lines: Merchandise[];
}): Promise<Response | undefined> {
  return await storefront(
    gql`
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines {
              id
              quantity
            }
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      cartId: cartId,
      lines: lines,
    }
  );
}

export async function removeLineItemsFromCart({
  cartID,
  lineIDs,
}: {
  cartID: string;
  lineIDs: string[];
}): Promise<Response | undefined> {
  return await storefront(
    gql`
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            lines {
              id
              quantity
            }
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      cartId: cartID,
      lineIds: lineIDs,
    }
  );
}

export async function updateLineItemsInCart({
  cartID,
  lines,
}: {
  cartID: string;
  lines: Merchandise[];
}): Promise<Response | undefined> {
  return await storefront(
    gql`
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines {
              id
              quantity
            }
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      cartId: cartID,
      lines: lines,
    }
  );
}
