import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

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
    href?: string;
  };
}) {
  return (
    <motion.div
      className={`toast toast-${placement} z-10`}
      animate={{ opacity: [100, 0] }}
      transition={{ ease: "easeOut", duration: 4 }}
    >
      <div className={`alert alert-${type} flex flex-col bg-success`}>
        <p>{message}</p>
        {action?.href && (
          <Link to={action.href} className="font-bold underline">
            {action.label}
          </Link>
        )}
      </div>
    </motion.div>
  );
}
