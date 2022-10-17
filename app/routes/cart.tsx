import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CartContent from "~/components/CartContent";

export const loader: LoaderFunction = async () => {
  return null;
};

export default function CartRoute() {
  // const { data } = useLoaderData<LoaderData>();
  return (
    <section className="p-8">
      <h1 className="text-6xl font-bold">Cart</h1>
      <div className="my-4">
        <CartContent />
      </div>
    </section>
  );
}
