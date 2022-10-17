import storefront from "./storefront";

type Merchandise = {
  merchandiseId: string;
  quantity: number;
};

export async function getCart(cartId: string) {
  return await storefront(
    `
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
                        merchandise {
                            ... on ProductVariant {
                                id
                                price {
                                    amount
                                }
                                image {
                                    url
                                    altText
                                }
                            }
                        }
                        quantity
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
}) {
  return await storefront(
    `
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
}) {
  return await storefront(
    `
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
}) {
  return await storefront(
    `
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
}) {
  return await storefront(
    `
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
