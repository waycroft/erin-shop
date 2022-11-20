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
      className={`my-4 flex flex-row justify-between items-${itemsAlign} container mx-auto`}
    >
      <div>
        <p className="text-3xl mb-2">{formattedSubtotal}</p>
        <p>Total Quantity: {totalQuantity}</p>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
