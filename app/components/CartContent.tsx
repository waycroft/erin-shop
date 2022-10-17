import { useFetcher } from "@remix-run/react";
import CartLineItem from "./CartLineItem";

export default function CartContent() {
  const fetcher = useFetcher();

  return (
    <div>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
      <h2>Subtotal</h2>
      {/* {cart.cost} */}
      $420.00
    </div>
  );
}
