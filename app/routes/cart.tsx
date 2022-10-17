import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CartContent, { Cart } from "~/components/CartContent";
import { getCart } from "~/utils/cart";

type LoaderData = {
  data: {
    cart: Cart;
  };
};

export const loader: LoaderFunction = async () => {
  return await getCart("gid://shopify/Cart/bca255ef4421801384d0eebd5b4d4fa3");
};

export default function CartRoute() {
  const { data } = useLoaderData<LoaderData>();

  return (
    <section className="p-8">
      <h1 className="text-6xl font-bold">Cart</h1>
      <div className="my-4">
        <CartContent contents={data.cart} />
      </div>
    </section>
  );
}
