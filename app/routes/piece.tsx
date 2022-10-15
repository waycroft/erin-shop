import { Outlet } from "@remix-run/react";

export default function SingleProductLayout() {
  return (
    <div>
      <section className="p-8">
        <Outlet />
      </section>
    </div>
  );
}
