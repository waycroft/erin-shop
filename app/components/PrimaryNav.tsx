import { Link } from "@remix-run/react";
import CartIcon from "./icons/CartIcon";
import HamburgerIcon from "./icons/HamburgerIcon";

export default function PrimaryNav() {
  return (
    <nav
      role="navigation"
      className="navbar flex flex-row justify-between bg-zinc-600"
    >
      <div>
        <Link to="/">ERIN HOFFMAN: SHOP</Link>
      </div>
      <div className="md:flex flex-row hidden">
        <div className="px-4">
          <a href="https://erinphoffman.com/work" target="_blank">
            Work
          </a>
        </div>
        <div className="px-4">
          <a href="https://erinphoffman.com/about" target="_blank">
            About
          </a>
        </div>
        <div className="px-4">
          <a href="https://erinphoffman.com" target="_blank">
            erinphoffman.com
          </a>
        </div>
        <div className="px-4">
          <label htmlFor="cart-drawer" className="drawer-button btn btn-circle">
            <CartIcon />
          </label>
        </div>
      </div>
      <div>
        <button className="btn btn-square btn-ghost">
          <HamburgerIcon />
        </button>
      </div>
    </nav>
  );
}
