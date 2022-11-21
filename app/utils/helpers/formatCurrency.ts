import invariant from "tiny-invariant";

export default function formatNumberIntoCurrency(
  number: number | string,
  currency = "USD"
) {
  invariant(!!number, "No input provided to format into currency");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(Number(number));
}
