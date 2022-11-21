import { useMatches } from "@remix-run/react";
import { Cart } from "~/utils/cartUtils";
import CartContent from "./CartContent";
import CartHeader from "./CartHeader";
import CartCheckoutButton from "./CheckoutButton";

export default function Drawer({
  cart,
  isStoreActive,
}: {
  cart: Cart;
  isStoreActive: boolean;
}) {
  const matches = useMatches();

  return (
    <div className="drawer-side">
      <label htmlFor="cart-drawer" className="drawer-overlay"></label>
      <section className="h-screen overflow-y-scroll p-4 w-5/6 md:w-8/12 lg:w-6/12 max-w-3xl text-base-content bg-base-100">
        <CartHeader
          subtotal={Number(cart.cost.subtotalAmount.amount)}
          totalQuantity={cart.totalQuantity}
          itemsAlign="center"
        >
          <div className="flex flex-col gap-2">
            <h1 className="hidden">Cart</h1>
            <CartCheckoutButton
              checkoutUrl={cart.checkoutUrl}
              disabled={cart?.totalQuantity <= 0 || !isStoreActive}
            />
            {matches[matches.length - 1].pathname !== "/cart" ? (
              <a
                href="/cart"
                className="btn btn-secondary btn-sm btn-outline lowercase"
              >
                Go to cart
              </a>
            ) : null}
          </div>
        </CartHeader>
        <CartContent cart={cart} />
      </section>
    </div>
  );
}
