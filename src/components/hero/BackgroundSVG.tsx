import { MotionValue, motion } from "framer-motion";
import { useMemo } from "react";
import LoopingAnimation from "./LoopingAnimation";

type BackgroundSVGProps = {
  width: number;
  height: number;
  isMobile: boolean;
  svgOpacity: MotionValue<number>;
};

const drawVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 5, bounce: 0 },
      opacity: { duration: 0.8, ease: "easeInOut" },
    },
  },
};

const BackgroundSVG: React.FC<BackgroundSVGProps> = ({
  width,
  height,
  isMobile,
  svgOpacity,
}) => {
  const renderSVGLines = useMemo(() => {
    if (width === 0 || height === 0) return null;

    if (isMobile) {
      // Render three lines for mobile: left, center, and right
      const centerX = width / 2;
      const xOffset = width * 0.3;
      const leftX = centerX - xOffset;
      const rightX = centerX + xOffset;

      return (
        <>
          <motion.path
            key="mobile-left-line"
            d={`M ${leftX} ${height / 2} L ${leftX} 0 M ${leftX} ${
              height / 2
            } L ${leftX} ${height}`}
            stroke="var(--gray-4)"
            strokeWidth="2"
            fill="none"
            variants={drawVariant}
          />
          <motion.path
            key="mobile-center-line"
            d={`M ${centerX} ${height / 2} L ${centerX} 0 M ${centerX} ${
              height / 2
            } L ${centerX} ${height}`}
            stroke="var(--gray-4)"
            strokeWidth="2"
            fill="none"
            variants={drawVariant}
          />
          <motion.path
            key="mobile-right-line"
            d={`M ${rightX} ${height / 2} L ${rightX} 0 M ${rightX} ${
              height / 2
            } L ${rightX} ${height}`}
            stroke="var(--gray-4)"
            strokeWidth="2"
            fill="none"
            variants={drawVariant}
          />
        </>
      );
    } else {
      const offsets = [
        -0.12 - 30 / width - 0.125,
        -0.12 - 30 / width,
        -0.12,
        0,
        0.12,
        0.12 + 30 / width,
        0.12 + 30 / width + 0.125,
      ];

      return offsets.map((offset, index) => {
        const x = width / 2 + width * offset;
        const centerY = height / 2;

        return (
          <motion.path
            key={index}
            d={`M ${x} ${centerY} L ${x} 0 M ${x} ${centerY} L ${x} ${height}`}
            stroke="var(--gray-4)"
            strokeWidth="2"
            fill="none"
            variants={drawVariant}
          />
        );
      });
    }
  }, [width, height, isMobile]);

  return (
    <motion.div
      style={{ opacity: svgOpacity }}
      className="fixed top-0 flex w-full overflow-hidden h-full flex-col justify-center items-center z-[1]"
    >
      {width > 0 && height > 0 && (
        <>
          <motion.svg
            width={width}
            height={height}
            initial="hidden"
            animate="visible"
            className="fixed top-0 left-0"
          >
            {renderSVGLines}
          </motion.svg>
          <LoopingAnimation width={width} height={height} isMobile={isMobile} />
        </>
      )}
    </motion.div>
  );
};

export default BackgroundSVG;
