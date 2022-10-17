import CartLineItem from "./CartLineItem";

export default function CartContent({ cart }) {
  return (
    <div className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <h1 className="text-xl font-bold">Cart</h1>
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
