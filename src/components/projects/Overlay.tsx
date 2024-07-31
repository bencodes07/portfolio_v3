import React from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";

const Overlay: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => {
  const progress = useSpring(0, { stiffness: 300, damping: 40 });

  const pathD = useTransform(
    progress,
    [0, 1],
    [
      "M 0 100 L 0 100 C 50 100 50 100 100 100 L 100 100 L 100 100 L 0 100",
      "M 0 0 L 0 100 C 50 0 50 0 100 100 L 100 100 L 100 0 L 0 0",
    ]
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
          onClick={onClose}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <motion.path
              d={pathD}
              fill="black"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 40,
              }}
              onUpdate={(latest: any) => {
                progress.set(1 - latest.y / 100);
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
