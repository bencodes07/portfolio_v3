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
      document.body.style.cursor = "wait";
      // Start the SVG animation
      await controls
        .start({
          pathLength: 1,
          transition: { duration: 2, ease: "easeInOut" },
        })
        .then(() => {
          document.body.style.cursor = "auto";
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
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.path
              d="M8 2 V28 M8 22 A7 7 0 1 1 8 22.01"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
