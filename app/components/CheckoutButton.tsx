export default function CartCheckoutButton({
  checkoutUrl,
  disabled,
}: {
  checkoutUrl: string;
  disabled: boolean;
}) {
  return (
    <div>
      {!disabled ? (
        <a href={checkoutUrl} className="btn btn-primary">
          Checkout
        </a>
      ) : (
        <button className="btn btn-primary" disabled>
          Checkout
        </button>
      )}
    </div>
  );
}
