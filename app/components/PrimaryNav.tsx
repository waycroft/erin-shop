import { Link } from "@remix-run/react";
import CartIcon from "./icons/CartIcon";
import HamburgerIcon from "./icons/HamburgerIcon";

export default function PrimaryNav({
  cartQuantity,
  setIsMobileNavOpen,
}: {
  cartQuantity: number;
  setIsMobileNavOpen: (state: boolean) => void;
}) {
  return (
    <nav
      role="navigation"
      className="navbar flex flex-row justify-between px-8 py-6"
    >
      <div className="font-light font-title text-lg sm:text-3xl">
        <Link to="/">erinhoffman::collect</Link>
      </div>
      <div>
        <div>
          <button
            className="mx-4 md:hidden btn btn-square btn-ghost"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <HamburgerIcon />
          </button>
          <div className="hidden md:flex flex-row">
            <div className="px-2">
              <a href="https://erinphoffman.com/work" target="_blank">
                work
              </a>
            </div>
            <div className="px-4">
              <a href="https://erinphoffman.com/about" target="_blank">
                about
              </a>
            </div>
            <div className="px-4">
              <a href="https://erinphoffman.com" target="_blank">
                erinhoffman.com
              </a>
            </div>
          </div>
        </div>
        <div className="indicator sm:pl-4">
          {cartQuantity > 0 ? (
            <span className="indicator-item badge badge-accent badge-xs text-base"></span>
          ) : null}
          <Link to="/cart">
            <CartIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
}
