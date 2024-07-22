import { useEffect, useState, useRef } from "react";
import "./assets/globals.scss";
import Navbar from "./components/Navbar";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import MouseGradient from "./components/MouseGradient";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./components/Magnetic";

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

  const aboutRef = useRef<HTMLDivElement>(null);

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

  const { scrollYProgress, scrollY } = useScroll();
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -400]);
  const aboutY = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const backgroundGradient = useMotionValue(
    "radial-gradient(circle, #111111 0%, #000000 65%)"
  );
  const textColor = useMotionValue("#FFFFFF");
  const svgOpacity = useMotionValue(1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const progress = Math.max(0, Math.min((latest - 0.2) / 0.2, 2));

    // Interpolate between the initial gradient and white
    const startColor = [17, 17, 17]; // #111111
    const endColor = [0, 0, 0]; // #000000
    const whiteColor = [255, 255, 255];

    const interpolateColor = (start: number[], _end: number[]): number[] =>
      start.map((channel, i) =>
        Math.round(channel + (whiteColor[i] - channel) * progress)
      );

    const centerColor = interpolateColor(startColor, whiteColor).join(", ");
    const outerColor = interpolateColor(endColor, whiteColor).join(", ");

    const newGradient = `radial-gradient(circle, rgb(${centerColor}) 0%, rgb(${outerColor}) 65%)`;
    backgroundGradient.set(newGradient);

    // Text color transition
    const txtColor = `rgb(${255 - Math.round(255 * progress)}, ${
      255 - Math.round(255 * progress)
    }, ${255 - Math.round(255 * progress)})`;
    textColor.set(txtColor);

    document.documentElement.style.setProperty(
      "--landing-bg-image",
      newGradient
    );

    const opacityProgress = Math.max(0, Math.min((latest - 0.2) / 0.2, 1));
    const newOpacity = 1 - opacityProgress;
    svgOpacity.set(newOpacity);
  });

  return (
    <>
      <MouseGradient />
      <motion.div
        style={{ background: backgroundGradient }}
        className="w-screen h-screen backdrop-blur-3xl overflow-x-hidden"
      >
        <motion.div
          style={{ opacity: svgOpacity }}
          className="absolute top-0 flex w-full h-full flex-col justify-center items-center z-[1]"
        >
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
        </motion.div>
        <div className="flex justify-center items-center relative z-10">
          <Navbar />
          <div className="h-screen flex flex-col justify-center items-center">
            <motion.h1
              className="text-[80px] text-light khula-extrabold w-[732px] text-center leading-[85px]"
              style={{
                y: textY,
                textShadow: "0px 0px 6px rgba(255,255,255,0.25)",
              }}
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
            </motion.h1>
            <motion.p
              style={{ y: textY }}
              className="poppins-regular text-gray-1 w-[420px] text-center text-xl mt-4 shadow-none"
            >
              Innovative web developer crafting unique user experiences.
            </motion.p>
          </div>
        </div>
      </motion.div>
      <motion.div
        ref={aboutRef}
        style={{ background: backgroundGradient }}
        className="w-screen flex justify-center items-center"
      >
        <motion.div
          style={{
            y: aboutY,
            opacity: useTransform(scrollY, [100, 700, 800], [0, 0, 1]),
          }}
          className="max-w-[1000px] h-screen"
        >
          <h1 className="khula-semibold text-6xl bg-light">
            I believe in a user centered design approach, ensuring that every
            project I work on is tailored to meet the specific needs of its
            users.{" "}
          </h1>

          <div className="mt-[10vh]">
            <p className="text-gray-3 poppins-light-italic ml-2 mb-1 select-none">
              This is me.
            </p>
            <motion.hr
              initial={{ width: "0%" }}
              animate={
                useInView(aboutRef, { amount: 0.55 })
                  ? { width: "100%" }
                  : { width: "0%" }
              }
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="bg-gray-2 origin-left w-full"
            ></motion.hr>
          </div>
          <div className="flex justify-between mx-4 mt-16">
            <div className="flex flex-col w-1/2">
              <motion.h2
                className="khula-light text-5xl"
                initial={{ opacity: 0, y: 50 }}
                animate={
                  useInView(aboutRef, { amount: 0.56 })
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
              >
                Hi, I'm Ben.
              </motion.h2>
              <Magnetic>
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    useInView(aboutRef, { amount: 0.57 })
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 50 }
                  }
                  transition={{ delay: 0.2 }}
                  className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max poppins-regular mt-24 select-none"
                >
                  <ArrowUpRight />
                  Get in Touch
                </motion.button>
              </Magnetic>
            </div>
            <div className="flex flex-col gap-y-4 w-1/2 khula-light text-2xl">
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  useInView(aboutRef, { amount: 0.57 })
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
              >
                I'm a passionate web developer dedicated to turning ideas into
                creative solutions. I specialize in creating seamless and
                intuitive user experiences.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  useInView(aboutRef, { amount: 0.57 })
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ delay: 0.1 }}
              >
                I'm involved in every step of the process: from discovery and
                design to development, testing, and deployment. I focus on
                delivering high-quality, scalable results that drive positive
                user experiences.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default App;
