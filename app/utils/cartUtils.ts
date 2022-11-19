import invariant from "tiny-invariant";
import { ProductVariant } from "~/utils/productUtils";
import storefront, { StorefrontAPIResponseObject } from "./storefront";

var gql = String.raw;

export type Merchandise = {
  merchandiseId: string;
  quantity: number;
};

export type CartLineItemInterface = {
  id: string;
  quantity: number;
  merchandise?: ProductVariant;
};

type NewCartInput = {
  merchandise: Merchandise[];
  attributes?: Record<string, string>[];
};

export type CartAction = "addLineItems" | "updateLineItems" | "removeLineItems";

export type CartLineItemId = string;

export async function editCart(action: CartAction, formData: FormData) {
  if (action === "addLineItems") {
    const merchandiseIds = formData
      .getAll("merchandiseId")
      .map((id) => id.toString());
    const quantities = formData
      .getAll("quantity")
      .map((quantity) => parseInt(quantity.toString()));
    const merchandise = merchandiseIds.map((merchandiseId, index) => {
      return { merchandiseId, quantity: quantities[index] };
    });

    await addLineItemsToCart({
      cartId: process.env.TEST_CART as string,
      lines: merchandise,
    });
    return null;
  }

  if (action === "updateLineItems") {
    const lineItems: CartLineItemInterface[] = formData
      .getAll("lineItems")
      .map((lineItem) => JSON.parse(lineItem.toString()));
    invariant(lineItems, "No line items were provided for update");

    await updateLineItemsInCart({
      cartId: process.env.TEST_CART as string,
      lines: lineItems,
    });
    return null;
  }

  if (action === "removeLineItems") {
    const lineItems: CartLineItemId[] = formData
      .getAll("lineItemId")
      .map((lineItem) => lineItem.toString());
    invariant(lineItems.length > 0, "No line items were provided for removal");

    await removeLineItemsFromCart({
      cartId: process.env.TEST_CART as string,
      lineIds: lineItems,
    });
    return null;
  }
}
export async function getCart(cartId: string): Promise<StorefrontAPIResponseObject> {
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
                    quantityAvailable
                    selectedOptions {
                      name
                      value
                    }
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
      }
    `,
    {
      cartId: cartId,
    }
  );
}

export async function createCart(
  input?: NewCartInput
): Promise<StorefrontAPIResponseObject> {
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
            lines(first: 50) {
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
    input ? { cartInput: input } : {}
  );
}

export async function addLineItemsToCart({
  cartId,
  lines,
}: {
  cartId: string;
  lines: Merchandise[];
}): Promise<StorefrontAPIResponseObject> {
  return await storefront(
    gql`
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
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
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
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
  cartId,
  lineIds,
}: {
  cartId: string;
  lineIds: CartLineItemId[];
}): Promise<StorefrontAPIResponseObject> {
  return await storefront(
    gql`
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            lines(first: 100) {
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
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId: cartId,
      lineIds: lineIds,
    }
  );
}

export async function updateLineItemsInCart({
  cartId,
  lines,
}: {
  cartId: string;
  lines: CartLineItemInterface[];
}): Promise<StorefrontAPIResponseObject> {
  return await storefront(
    gql`
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
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
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
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
