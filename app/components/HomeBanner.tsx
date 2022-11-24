import { AnimatePresence, motion } from "framer-motion";
import XErrorIcon from "./icons/XErrorIcon";

export default function HomeBanner({
  isBannerVisible,
  setIsBannerVisible,
}: {
  isBannerVisible: boolean;
  setIsBannerVisible: (isBannerVisible: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {isBannerVisible ? (
        <motion.div
          className="relative bg-amber-300 text-neutral p-2 drop-shadow-sm"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.174, ease: "easeInOut" }}
        >
          <p className="text-center text-xs md:text-base">
            Not currently accepting orders.
          </p>
          <button
            className="px-3 absolute top-1 right-0 md:top-2"
            // onClick={() => console.log("click")}
            onClick={() => setIsBannerVisible(false)}
          >
            <XErrorIcon />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
