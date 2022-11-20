import { Session } from "@remix-run/node";
import invariant from "tiny-invariant";
import { ProductVariant } from "~/utils/productUtils";
import storefront, { StorefrontAPIResponseObject } from "./storefront";

var gql = String.raw;

export type Cart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: {
      amount: string;
    };
  };
  totalQuantity: number;
  updatedAt: string;
  createdAt: string;
  lines: {
    edges: {
      node: CartLineItemInterface;
    }[];
  };
};

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

export async function handleIncomingCartSession(session: Session) {
  let cart: Cart;
  if (session.has("cartId")) {
    const res = await getCart(session.get("cartId"));
    invariant(!(res.errors && res.userErrors), "Error fetching cart");
    cart = res.data.cart;
  } else {
    const res = await createCart();
    invariant(!(res.errors && res.userErrors), "Error creating cart");
    invariant(
      res.data?.cartCreate?.cart,
      "createCart() didn't return a cart for some reason"
    );
    cart = res.data.cartCreate.cart;
    session.set("cartId", cart.id);
  }
  return cart;
}

export async function editCart(action: CartAction, formData: FormData) {
  const cartId = formData.get("cartId")?.toString();
  invariant(!!cartId, "No cartId provided");

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
      cartId: cartId,
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
      cartId: cartId,
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
      cartId: cartId,
      lineIds: lineItems,
    });
    return null;
  }
}
export async function getCart(
  cartId: string
): Promise<StorefrontAPIResponseObject> {
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
