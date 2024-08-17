import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

type CurveProps = {
  isVisible: boolean;
};

export default function Curve({ isVisible }: CurveProps) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });
  const controls = useAnimationControls();

  useEffect(() => {
    function resize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isVisible, controls]);

  const curveHeight = dimensions.height * 0.1; // 10% of view height

  const initialPath = `
    M0 ${dimensions.height + curveHeight}
    Q${dimensions.width / 2} ${dimensions.height + curveHeight} ${
      dimensions.width
    } ${dimensions.height + curveHeight}
    L${dimensions.width} ${dimensions.height + curveHeight}
    L0 ${dimensions.height + curveHeight}
  `;

  const midPath = `
    M0 ${curveHeight}
    Q${dimensions.width / 2} 0 ${dimensions.width} ${curveHeight}
    L${dimensions.width} ${dimensions.height + curveHeight}
    L0 ${dimensions.height + curveHeight}
  `;

  const targetPath = `
    M0 ${-curveHeight}
    Q${dimensions.width / 2} ${-curveHeight * 2} ${
      dimensions.width
    } ${-curveHeight}
    L${dimensions.width} ${dimensions.height + curveHeight}
    L0 ${dimensions.height + curveHeight}
  `;

  const variants = {
    hidden: {
      d: [targetPath, midPath, initialPath],
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
        times: [0, 0.4, 1],
      },
    },
    visible: {
      d: [initialPath, midPath, targetPath],
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
        times: [0, 0.6, 1],
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ top: "100%" }}
      animate={{ top: isVisible ? `-${curveHeight}px` : "100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <svg
        className="absolute top-0 left-0 w-full"
        height={dimensions.height + curveHeight}
        preserveAspectRatio="none"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height + curveHeight}`}
      >
        <motion.path
          fill="black"
          variants={variants}
          initial="hidden"
          animate={controls}
        />
      </svg>
    </motion.div>
  );
}
