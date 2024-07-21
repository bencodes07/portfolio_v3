import { useEffect, useState, useRef } from "react";
import "./assets/globals.scss";
import Navbar from "./components/Navbar";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import MouseGradient from "./components/MouseGradient";

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

const shapeVariants = {
  hidden: { pathLength: 0, fillOpacity: 0, y: 0 },
  visible: {
    pathLength: 1,
    fillOpacity: 1,
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
      fillOpacity: { duration: 0.5, delay: 2 },
    },
  },
  exit: {
    y: "100%",
    transition: { duration: 1, ease: "easeInOut" },
  },
};

function AnimatedShape({
  side,
  onComplete,
  width,
  height,
}: {
  side: "left" | "right";
  onComplete: () => void;
  width: number;
  height: number;
}) {
  const controls = useAnimationControls();
  const centerX = width / 2;
  const yStart = (height * 2) / 3;
  const xOffset = width * 0.12;

  const path = `M ${centerX + (side === "left" ? -xOffset : xOffset)} ${yStart} 
                L ${centerX} ${yStart + 100} 
                L ${centerX} ${yStart + 132} 
                L ${centerX + (side === "left" ? -xOffset : xOffset)} ${
    yStart + 32
  } Z`;

  useEffect(() => {
    const animate = async () => {
      await controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await controls.start("exit");
      onComplete();
    };
    animate();
  }, [controls, onComplete]);

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute top-0 left-0"
    >
      <motion.path
        d={path}
        stroke="var(--gray-4)"
        strokeWidth="2"
        fill="var(--gray-4)"
        animate={controls}
        initial="hidden"
        variants={shapeVariants}
      />
    </motion.svg>
  );
}

function LoopingAnimation({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [key, setKey] = useState(0);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
      >
        <AnimatedShape
          side="left"
          onComplete={() => setKey((k) => k + 1)}
          width={width}
          height={height}
        />
        <AnimatedShape
          side="right"
          onComplete={() => {}}
          width={width}
          height={height}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dimensionsRef.current = newDimensions;
      setDimensions(newDimensions);
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();
    })();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { width, height } = dimensions;

  const renderSVGLines = () => {
    if (width === 0 || height === 0) return null;

    const offsets = [
      0,
      -0.12,
      0.12,
      -0.12 - 30 / width,
      0.12 + 30 / width,
      -0.12 - 30 / width - 0.125,
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
  };

  return (
    <>
      <div className="w-screen h-screen bg-landing-bg-image backdrop-blur-3xl overflow-x-hidden">
        <MouseGradient />
        <div className="absolute top-0 flex w-full h-full flex-col justify-center items-center z-[1]">
          {width > 0 && height > 0 && (
            <>
              <motion.svg
                width={width}
                height={height}
                initial="hidden"
                animate="visible"
                className="absolute"
              >
                {renderSVGLines()}
              </motion.svg>
              <LoopingAnimation width={width} height={height} />
            </>
          )}
        </div>
        <div className="flex justify-center items-center relative z-10">
          <Navbar />
          <div className="h-screen flex flex-col justify-center items-center">
            <h1
              className="text-[80px] text-light khula-extrabold w-[732px] text-center leading-[85px]"
              style={{ textShadow: "0px 0px 6px rgba(255,255,255,0.25)" }}
            >
              Turning ideas into{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #FE7171 0%, #EC5500 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                creative
              </span>{" "}
              solutions.
            </h1>
            <p className="poppins-regular text-gray-1 w-[420px] text-center text-xl mt-4 shadow-none">
              Innovative web developer crafting unique user experiences.
            </p>
          </div>
        </div>
      </div>
      <div className="w-screen h-screen">Test</div>
    </>
  );
}

export default App;
