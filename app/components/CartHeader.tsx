import formatNumberIntoCurrency from "~/utils/helpers/formatCurrency";

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
  const formattedSubtotal = formatNumberIntoCurrency(subtotal);

  return (
    <div
      className={`mt-4 mb-16 flex flex-row justify-between items-${itemsAlign} container mx-auto`}
    >
      <div className={totalQuantity <= 0 ? "text-base-300" : ""}>
        <p className="text-2xl sm:text-3xl mb-2">{formattedSubtotal}</p>
        <p className="text-sm sm:text-base">Total Quantity: {totalQuantity}</p>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
