export default function CartHeader({
  subtotal,
  totalQuantity,
  itemsAlign = "end",
  children,
}: {
  subtotal: number;
  totalQuantity: number;
  itemsAlign: "start" | "center" | "end";
  children?: React.ReactNode;
}) {
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  return (
    <div
      className={`my-4 flex flex-row justify-between items-${itemsAlign} text-right`}
    >
      <div>{children}</div>
      <div>
        <p className="text-3xl my-2">{formattedSubtotal}</p>
        <p>Total Quantity: {totalQuantity}</p>
      </div>
    </div>
  );
}
