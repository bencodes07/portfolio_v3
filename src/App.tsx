import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./assets/globals.scss";
import Navbar from "./components/Navbar";
import {
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
import { debounce } from "lodash";
import LoopingAnimation from "./components/LoopingAnimation";

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

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutControls = useAnimationControls();
  const isAboutInView = useInView(aboutRef, { amount: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const isMobile = useMemo(() => window.innerWidth <= 768, []);

  const updateDimensions = useCallback(
    debounce(() => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dimensionsRef.current = newDimensions;
      setDimensions(newDimensions);
    }, 200),
    []
  );

  useEffect(() => {
    if (window.innerWidth > 768) {
      (async () => {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        new LocomotiveScroll();
      })();
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const { width, height } = dimensions;

  const renderSVGLines = useMemo(() => {
    if (width === 0 || height === 0) return null;

    if (isMobile) {
      // Render three lines for mobile: left, center, and right
      const centerX = width / 2;
      const xOffset = width * 0.3; // This should match the xOffset in AnimatedShape
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
      // Existing code for desktop lines
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

  const { scrollYProgress } = useScroll();
  const backgroundGradient = useMotionValue(
    "radial-gradient(circle, #111111 0%, #000000 65%)"
  );
  const textColor = useMotionValue("#FFFFFF");
  const svgOpacity = useMotionValue(1);

  const handleScroll = useCallback((latest: number) => {
    requestAnimationFrame(() => {
      const progress = Math.max(0, Math.min((latest - 0.1) / 0.2, 1));

      const startColor = [0, 0, 0];
      const endColor = [255, 255, 255]; // #FFFFFF

      const interpolateColor = (start: number[], end: number[]): string =>
        start
          .map((channel, i) =>
            Math.round(channel + (end[i] - channel) * progress)
          )
          .join(", ");

      const newGradient = `radial-gradient(circle, rgb(${interpolateColor(
        [17, 17, 17],
        endColor
      )}) 0%, rgb(${interpolateColor(startColor, endColor)}) 65%)`;
      backgroundGradient.set(newGradient);

      const txtColor = `rgb(${255 - Math.round(255 * progress)}, ${
        255 - Math.round(255 * progress)
      }, ${255 - Math.round(255 * progress)})`;
      textColor.set(txtColor);
      const newOpacity = 1 - progress;
      svgOpacity.set(newOpacity);
    });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", handleScroll);

  useEffect(() => {
    if (isAboutInView && !hasAnimated) {
      aboutControls.start("visible");
      setHasAnimated(true);
    } else if (!isAboutInView && hasAnimated) {
      aboutControls.start("hidden");
      setHasAnimated(false);
    }
  }, [isAboutInView, aboutControls, hasAnimated]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: custom * 0.2,
      },
    }),
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <MouseGradient isMobile={isMobile} />
      <motion.div
        style={{ background: backgroundGradient }}
        className="w-screen overflow-hidden h-screen flex flex-col justify-center items-center "
      >
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

              <LoopingAnimation
                width={width}
                height={height}
                isMobile={isMobile}
              />
            </>
          )}
        </motion.div>
        <Navbar />
        <div className="flex justify-center items-center relative z-10">
          <motion.h1
            className="text-[80px] max-sm:text-[10vw] max-sm:max-w-sm max-sm:leading-tight text-light khula-extrabold w-[732px] text-center leading-[85px]"
            style={{
              transform: isMobile
                ? "none"
                : useTransform(
                    scrollYProgress,
                    [0, 0.5],
                    ["translateY(0px)", "translateY(-200px)"]
                  ),
              opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
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
        </div>
      </motion.div>
      <motion.div
        ref={aboutRef}
        style={{ background: backgroundGradient }}
        className="w-screen min-h-screen overflow-hidden flex justify-center items-center"
      >
        <motion.div
          initial="hidden"
          animate={aboutControls}
          className="max-w-[1000px] px-4"
        >
          <motion.h1
            variants={fadeInUpVariants}
            custom={0}
            className="khula-semibold text-6xl max-sm:text-4xl"
          >
            I believe in a user centered design approach, ensuring that every
            project I work on is tailored to meet the specific needs of its
            users.
          </motion.h1>

          <motion.div
            variants={fadeInUpVariants}
            custom={1}
            className="mt-[10vh] max-sm:mt-8"
          >
            <p className="text-gray-3 poppins-light-italic ml-2 mb-1 select-none">
              This is me.
            </p>
            <motion.hr
              variants={lineVariants}
              className="bg-gray-3 origin-left w-full"
            ></motion.hr>
          </motion.div>
          <div className="flex justify-between max-sm:flex-col flex-row mt-16 max-sm:mt-8">
            <div className="flex flex-col w-1/2">
              <motion.h2
                variants={fadeInUpVariants}
                custom={2}
                className="khula-light text-5xl text-nowrap"
              >
                Hi, I'm Ben.
              </motion.h2>
              {!isMobile && (
                <Magnetic>
                  <motion.button
                    variants={fadeInUpVariants}
                    custom={3}
                    className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max poppins-regular mt-24 select-none"
                  >
                    <ArrowUpRight />
                    Get in Touch
                  </motion.button>
                </Magnetic>
              )}
            </div>
            <div className="flex flex-col gap-y-4 w-1/2 khula-light text-2xl max-sm:text-lg max-sm:w-full max-sm:mt-8">
              <motion.p variants={fadeInUpVariants} custom={4}>
                I'm a passionate web developer dedicated to turning ideas into
                creative solutions. I specialize in creating seamless and
                intuitive user experiences.
              </motion.p>
              <motion.p variants={fadeInUpVariants} custom={5}>
                I'm involved in every step of the process: from discovery and
                design to development, testing, and deployment. I focus on
                delivering high-quality, scalable results that drive positive
                user experiences.
              </motion.p>
            </div>
            {isMobile && (
              <motion.button
                variants={fadeInUpVariants}
                custom={3}
                className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max poppins-regular select-none mt-8"
              >
                <ArrowUpRight />
                Get in Touch
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
      {/* Add some blank space */}
      <div style={{ height: "100vh", background: "#ffffff" }} />
    </>
  );
}

export default App;
