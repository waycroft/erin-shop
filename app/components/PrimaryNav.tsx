import { Link } from "@remix-run/react";
import CartIcon from "./icons/CartIcon";
import HamburgerIcon from "./icons/HamburgerIcon";

export default function PrimaryNav({ cartQuantity }: { cartQuantity: number }) {
  return (
    <nav
      role="navigation"
      className="navbar flex flex-row justify-between px-8 py-6"
    >
      <div className="font-medium font-title text-4xl">
        <Link to="/">erinhoffman::collect</Link>
      </div>
      <div>
        <div>
          <button className="md:hidden btn btn-square btn-ghost">
            <HamburgerIcon />
          </button>
          <div className="hidden md:flex flex-row">
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
          </div>
        </div>
        <div className="indicator pl-4">
          {cartQuantity > 0 ? (
            <span className="indicator-item badge badge-accent text-base">
              {cartQuantity}
            </span>
          ) : null}
          <label htmlFor="cart-drawer" className="drawer-button btn btn-circle">
            <CartIcon />
          </label>
        </div>
      </div>
    </nav>
  );
}
