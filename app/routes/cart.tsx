import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CartContent, { Cart } from "~/components/CartContent";
import { getCart } from "~/utils/cartUtils";

type LoaderData = {
  data: {
    cart: Cart;
  };
};

export const loader: LoaderFunction = async () => {
  const cart = await getCart(process.env.TEST_CART as string);
  return cart;
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.message}</p>
      <p>Stack:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function CartRoute() {
  const { data } = useLoaderData<LoaderData>();
  const cartContents = data?.cart;

  return (
    <section className="p-8">
      <h1 className="text-6xl font-bold">Cart</h1>
      <div className="my-4">
        <CartContent cartContents={cartContents} />
      </div>
    </section>
  );
}
