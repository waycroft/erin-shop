export default function CartCheckoutButton({
  checkoutUrl,
  disabled = false,
}: {
  checkoutUrl: string;
  disabled?: boolean;
}) {
  return (
    <div>
      {!disabled ? (
        <a href={checkoutUrl} className="btn btn-primary md:btn-lg lowercase">
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
