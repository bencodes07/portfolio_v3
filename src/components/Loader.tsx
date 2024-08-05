import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface LoaderProps {
  onLoadingComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete }) => {
  const [show, setShow] = useState<boolean>(true);
  const controls = useAnimation();
  const animationCompleted = useRef<boolean>(false);

  useEffect(() => {
    const animateSvg = async () => {
      // Start the SVG animation
      await controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: "easeInOut" },
      });

      // Wait 300ms after animation completes
      await new Promise((resolve) => setTimeout(resolve, 300));

      animationCompleted.current = true;

      // Only now check if the page has loaded
      if (document.readyState === "complete") {
        setShow(false);
      } else {
        window.addEventListener("load", handlePageLoad);
      }
    };

    const handlePageLoad = () => {
      if (animationCompleted.current) {
        setShow(false);
      }
    };

    // Start animation
    animateSvg();

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, [controls]);

  // Call onLoadingComplete when the loader starts to fade out
  useEffect(() => {
    if (!show) {
      onLoadingComplete();
    }
  }, [show, onLoadingComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            zIndex: 9999,
          }}
        >
          <motion.svg
            width="100"
            height="100"
            viewBox="-5.5 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M4.156 2.031v10.125c1.656-1.813 4.125-3 6.75-3 4.75 0 8.594 3.75 8.594 8.438s-3.844 8.438-8.594 8.438c-2.625 0-5.094-1.188-6.75-3v2.563h-2.25v-23.563h2.25zM10.875 23.969c3.594 0 6.469-2.844 6.469-6.375s-2.875-6.375-6.469-6.375-6.719 2.844-6.719 6.375 3.125 6.375 6.719 6.375z"
              fill="none"
              stroke="#000000"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={controls}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
