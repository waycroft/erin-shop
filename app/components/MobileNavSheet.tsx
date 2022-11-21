import XErrorIcon from "./icons/XErrorIcon";

export default function MobileNavSheet({
  setIsMobileNavOpen,
}: {
  setIsMobileNavOpen: (state: boolean) => void;
}) {
  return (
    <div className="fixed h-screen w-screen bg-base-100 z-10 top-0">
      <div className="p-4">
        <button onClick={() => setIsMobileNavOpen(false)}>
          <XErrorIcon />
        </button>
      </div>
      <nav className="h-full">
        <ol className="flex flex-col gap-8 place-content-center h-full text-center">
          <li>
            <a
              href="https://erinphoffman.com/work"
              target="_blank"
              className="p-4"
            >
              work
            </a>
          </li>
          <li>
            <a
              href="https://erinphoffman.com/about"
              target="_blank"
              className="p-4"
            >
              about
            </a>
          </li>
          <li>
            <a href="https://erinphoffman.com" target="_blank" className="p-4">
              erinhoffman.com
            </a>
          </li>
        </ol>
      </nav>
    </div>
  );
}