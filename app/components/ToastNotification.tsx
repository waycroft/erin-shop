import { Link } from "@remix-run/react";

// TODO: I want to use setTimeout to fade out toast.

export default function ToastNotification({
  type,
  message,
  placement = "bottom",
  action,
}: {
  type: "success" | "error";
  message: string;
  placement?: string;
  action?: {
    label: string;
    href: string;
  };
}) {
  return (
    <div className={`toast toast-${placement}`}>
      <div className={`alert alert-${type} flex flex-col`}>
        <p>{message}</p>
        {action && (
          <Link to={action.href} className="font-bold underline">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
