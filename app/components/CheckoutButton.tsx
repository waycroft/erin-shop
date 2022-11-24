export default function CartCheckoutButton({
  checkoutUrl,
  disabled = false,
  disabledReason,
}: {
  checkoutUrl: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  return (
    <div>
      {!disabled ? (
        <a href={checkoutUrl} className="btn btn-primary md:btn-lg lowercase">
          Checkout
        </a>
      ) : (
        <div className="tooltip tooltip-left" data-tip={disabledReason}>
          <button className="btn btn-primary lowercase" disabled>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
